// import React, { useState, Fragment } from 'react';
// import { useTracker, useSubscribe } from "meteor/react-meteor-data";
// import { TasksCollection } from "/imports/api/TasksCollection";
// import { Task } from "./Task";
// import { TaskForm } from "./TaskForm";
// import { Meteor } from 'meteor/meteor';
// import { LoginForm } from './LoginForm';

// export const App = () => {
//   const user = useTracker(() => Meteor.user());
//   console.log("User:", user);
//   const [hideCompleted, setHideCompleted] = useState(false);
//   const hideCompletedFilter = { isChecked: { $ne: true } };
//   const isLoading = useSubscribe("tasks");

//   const tasks = useTracker(() => {
//     if (!user) {
//       return [];
//     }

//     return TasksCollection.find(
//       hideCompleted ? hideCompletedFilter : {},
//       {
//         sort: { createdAt: -1 },
//       }
//     ).fetch();
//   });

//   console.log(tasks)

//   const handleToggleChecked = ({ _id, isChecked }) => 
//     Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });

//   const handleDelete = ({ _id }) =>
//     Meteor.callAsync("tasks.delete", { _id });

//   const pendingTasksCount = useTracker(() => {
//     if (!user) {
//       return 0;
//     }
//     return TasksCollection.find(hideCompletedFilter).count();
//   });

//   const pendingTasksTitle = pendingTasksCount ? ` (${pendingTasksCount})` : '';

//   const logout = () => Meteor.logout();

//   if (isLoading()) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="app">
//       <header>
//         <div className="app-bar">
//           <div className="app-header">
//             <h1>📝️ To Do List</h1>
//             {pendingTasksTitle}
//           </div>
//         </div>
//       </header>
//       <div className="main">
//         {user ? (
//           <Fragment>
//             <TaskForm />
//             <div className="user" onClick={logout}>
//               {user.username} 🚪
//             </div>
//             <div className="filter">
//               <button onClick={() => setHideCompleted(!hideCompleted)}>
//                 {hideCompleted ? 'Show All' : 'Hide Completed'}
//               </button>
//             </div>

//             <ul className="tasks">
//               {tasks.map(task => (
//                 <Task
//                   key={task._id}
//                   task={task}
//                   onCheckboxClick={handleToggleChecked}
//                   onDeleteClick={handleDelete}
//                 />
//               ))}
//             </ul>
//           </Fragment>
//         ) : (
//           <LoginForm />
//         )}
//       </div>
//     </div>
//   );
// };