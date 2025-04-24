import React, { useState } from "react";
import styles from "./AdminPanel.module.css";

const endpoints = [
  // {
  //   category: "Authentication",
  //   methods: [
  //     { name: "Login", type: "POST", url: "/api/Authentication/login", params: ["email", "password"] },
  //     { name: "Register", type: "POST", url: "/api/Authentication/Register", params: ["email", "password", "name"] },
  //     { name: "Logout", type: "POST", url: "/api/Authentication/Logout" },
  //   ],
  // },
  {
    category: "Favorites",
    methods: [
      { name: "Get All Favorites", type: "GET", url: "/api/Favorites" },
      { name: "Create Favorite", type: "POST", url: "/api/Favorites", params: ["title", "description", "type"] },
      { name: "Update Favorite by ID", type: "PUT", url: "/api/Favorites/{favoriteId}", params: ["favoriteId", "title", "description", "type"] },
      { name: "Delete Favorite by ID", type: "DELETE", url: "/api/Favorites/{favoriteId}", params: ["favoriteId"] },
    ],
  },
  {
    category: "Movies",
    methods: [
      { name: "Get All Movies", type: "GET", url: "/api/Movies" },
      // { name: "Create Movie", type: "POST", url: "/api/Movies", params: ["title", "releaseYear", "duration", "imdbRating", "description", "categoryIds"] },
      { name: "Get Movie by ID", type: "GET", url: "/api/Movies/{movieId}", params: ["movieId"] },
      // { name: "Update Movie by ID", type: "PUT", url: "/api/Movies/{movieId}", params: ["movieId", "title", "releaseYear", "duration", "imdbRating", "description", "categoryIds"] },
      { name: "Delete Movie by ID", type: "DELETE", url: "/api/Movies/{movieId}", params: ["movieId"] },
    ],
  },
  {
    category: "Series",
    methods: [
      { name: "Get All Series", type: "GET", url: "/api/Series" },
      // { name: "Create Series", type: "POST", url: "/api/Series", params: ["title", "numberOfSeasons", "numberOfEpisodes", "rating", "description", "startYear", "endYear", "categoryIds"] },
      { name: "Get Series by ID", type: "GET", url: "/api/Series/{seriesId}", params: ["seriesId"] },
      // { name: "Update Series by ID", type: "PUT", url: "/api/Series/{seriesId}", params: ["seriesId", "title", "numberOfSeasons", "numberOfEpisodes", "rating", "description", "startYear", "endYear", "categoryIds"] },
      { name: "Delete Series by ID", type: "DELETE", url: "/api/Series/{seriesId}", params: ["seriesId"] },
    ],
  },
  {
    category: "Users",
    methods: [
      { name: "Get All Users", type: "GET", url: "/api/Users" },
      { name: "Create User", type: "POST", url: "/api/Users", params: ["name", "email", "password"] },
      { name: "Get User by ID", type: "GET", url: "/api/Users/{userId}", params: ["userId"] },
      { name: "Update User by ID", type: "PUT", url: "/api/Users/{userId}", params: ["userId", "name", "email", "password"] },
      { name: "Delete User by ID", type: "DELETE", url: "/api/Users/{userId}", params: ["userId"] },
    ],
  },
];

const AdminPanel: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateParams = (requiredParams: string[]): boolean => {
    const newErrors: Record<string, string> = {};
    requiredParams.forEach((param) => {
      if (!params[param]) {
        newErrors[param] = `${param} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRequest = async (method: string, url: string, requiredParams: string[] = []) => {
    if (!validateParams(requiredParams)) return;

    setLoading(true);
    setResponse(null);

    try {
      let formattedUrl = url;
      requiredParams.forEach((param) => {
        if (url.includes(`{${param}}`)) {
          formattedUrl = formattedUrl.replace(`{${param}}`, params[param] || "");
        }
      });

      const bodyParams = requiredParams.reduce((acc, param) => {
        if (!url.includes(`{${param}}`)) {
          acc[param] = params[param];
        }
        return acc;
      }, {} as Record<string, string>);

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (["POST", "PUT"].includes(method)) {
        options.body = JSON.stringify(bodyParams);
      }

      const res = await fetch(`http://localhost:5114${formattedUrl}`, options);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error: ${res.status} - ${res.statusText} - ${errorData.message || "Unknown Error"}`);
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Panel</h1>
      {endpoints.map((group) => (
        <div key={group.category} className={styles.endpointGroup}>
          <h2 className={styles.groupTitle}>{group.category}</h2>
          <div className={styles.buttonsContainer}>
            {group.methods.map((method) => (
              <div key={method.name}>
                <h3>
                  {method.type}: {method.name}
                </h3>
                {method.params && (
                  <div>
                    {method.params.map((param) => (
                      <div key={param}>
                        <input
                          type="text"
                          placeholder={param}
                          value={params[param] || ""}
                          onChange={(e) => handleInputChange(param, e.target.value)}
                          className={styles.paramInput}
                        />
                        {errors[param] && <span className={styles.error}>{errors[param]}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleRequest(method.type, method.url, method.params)}
                  className={styles.endpointButton}
                >
                  Execute
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.responseContainer}>
        <h2>Response:</h2>
        {loading ? <p>Loading...</p> : <pre>{response}</pre>}
      </div>
    </div>
  );
};

export default AdminPanel;
