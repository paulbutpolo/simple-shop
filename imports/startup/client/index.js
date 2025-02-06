import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import React from "react";
import { App } from "../../ui/App";

// import Client from "../../client/Client";
// Meteor.startup(() => {
//     const container = document.getElementById("react-target");
//     const root = createRoot(container);
//     const start = () => {
//         Client.startHandshake().then((success) => {
//             if (success)
//                 root.render(<App />);
//             else
//                 start();
//         }).catch(() => {
//             root.render(<h5>Invalid Client version!</h5>);
//             setTimeout(() => {
//                 window.location.reload();
//             }, 1500);
//         });
//     };
//     start();
// });

Meteor.startup(() => {
    const container = document.getElementById('react-target');
    const root = createRoot(container);
    console.log("Starting the Client and rendering the App.jsx")
    root.render(<App />);
});