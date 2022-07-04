import React from 'react';
import ReactDOM from 'react-dom';
import UsersList from "./components/UsersList";

function renderUsersPage(element, props) {
    ReactDOM.render((
        <div className={"App"}>
            <UsersList baseUrl={props.baseUrl}/>
        </div>
    ), element);
}

window.renderUserPage = renderUsersPage;

export default renderUsersPage;
