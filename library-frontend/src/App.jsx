import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/LoginForm";
import { useApolloClient } from '@apollo/client';
import Recommend from "./components/Recommend";



const App = () => {
  const [page, setPage] = useState("books");
  const [token, setToken] = useState(null)
  const hideWhenToken = { display: token ? '' : 'none'}
  const showWhenToken = { display: token ? 'none' : ''}
  const client = useApolloClient()
  const [me, setMe] = useState(null)

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('phonenumbers-user-token')
    if (loggedUser) {
        setToken(loggedUser)
    }
}, [])



  const logout = () => {
    setPage("books")
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }



  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")} style = {hideWhenToken}>add book</button>
        <button onClick={() => setPage("recommend")} style = {hideWhenToken}>Recommend</button>
        <button onClick={logout} style = {hideWhenToken}>logout</button>
        <button onClick={() => setPage("login")} style = {showWhenToken}>login</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage}/>

      <Recommend show={page === "recommend"} token={token} />
    </div>
  );
};

export default App;
