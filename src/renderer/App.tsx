import "./app.css";
import React, { useEffect, useState } from "react";
import { Link, Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  const [url, setUrl] = useState<string>(
    "https://www.youtube.com/embed/b-Cr0EWwaTk?autoplay=1&start=15"
  );

  useEffect(() => {
    electron
      .getUrl()
      .then((u) => {
        setUrl(u);
      })
      .catch(console.error);
  });

  return (
    <iframe
      id="iframe"
      width="100%"
      height="100%"
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}
