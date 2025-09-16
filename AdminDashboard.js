import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title="Admin Dashboard">
      <div className="container-fluid dashboard py-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card shadow-lg border-0 p-4">
              <h2 className="text-center mb-4">Admin Profile</h2>
              <div className="row">
                <div className="col-md-12">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Name: </strong> {auth?.user?.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Email: </strong> {auth?.user?.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Contact: </strong> {auth?.user?.phone}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;


// import React from "react";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "./../../components/Layout/Layout";
// import { useAuth } from "../../context/auth";
// const AdminDashboard = () => {
//   const [auth] = useAuth();
//   return (
//     <Layout>
//       <div className="container-fluid m-3 p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="card w-75 p-3">
//               <h3> Admin Name : {auth?.user?.name}</h3>
//               <h3> Admin Email : {auth?.user?.email}</h3>
//               <h3> Admin Contact : {auth?.user?.phone}</h3>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboard;
