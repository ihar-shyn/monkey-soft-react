import './App.css';
import DepartmentList from "./components/DepartmentList";

function App() {
  return (
    <div className="App">
      <DepartmentList baseUrl="http://localhost:8080"/>
    </div>
  );
}

export default App;
