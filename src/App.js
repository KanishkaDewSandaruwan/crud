import React from 'react';
import AddList from "crud/AddList";
import formData from "./formData.json";

function App() {
  return (
    <>
      <AddList
        moduleName="Subject Management"
        formData={formData}
        table={true}
      />
    </>
  );
}

export default App;
