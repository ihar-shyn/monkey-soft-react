import React from 'react';
import ReactDOM from 'react-dom';
import DepartmentList from "./components/DepartmentList";

function renderDepartmentPage(element, props) {
    ReactDOM.render((
        <DepartmentList baseUrl={props.baseUrl}/>
    ), element);
}

window.renderDepartmentPage = renderDepartmentPage;

export default renderDepartmentPage;
