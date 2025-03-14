import React, {useEffect, useRef, useState} from 'react';
import { Form } from '@bpmn-io/form-js-viewer';
import '@bpmn-io/form-js-viewer/dist/assets/form-js.css';
import {useLocation} from "react-router-dom";

const FormViewer = () => {
  const containerRef = useRef(null);
  const [schema, setSchema] = useState(null);
  const location = useLocation();


  useEffect(() => {
    if (location.state) {
      console.log(location.state)
      setSchema(location.state.schema)
    const form = new Form({
      container: containerRef.current,
    });

    form.importSchema(schema, {}).then(() => {
      console.log('Schema imported successfully');
    }).catch(err => {
      console.error('Error importing schema', err);
    });

    // Add event listeners
    form.on('submit', (event) => {
      console.log('Form <submit>', event);
    });

    // Provide a priority to event listeners
    form.on('changed', 500, (event) => {
      console.log('Form <changed>', event);
    });

    return () => {
      form.destroy();
    };}
  }, [schema]);

  const handleSubmit = () => {
    const form = containerRef.current.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div
        ref={containerRef}
        className="border border-gray-300 mt-4 rounded-md min-h-[300px]"
      />
      {/*<button*/}
      {/*    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4"*/}
      {/*    onClick={handleSubmit}*/}
      {/*>*/}
      {/*  Submit*/}
      {/*</button>*/}
    </div>
  );
};

export default FormViewer;