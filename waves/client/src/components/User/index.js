import React from "react";
import UserLayout from "../../hoc/user";
import MyButton from "../utils/button";
import UserHistoryBlock from "../utils/User/history_block";

const UserDashboard = ({
  user: {
    userData: { name, lastname, email, history }
  }
}) => {
  return (
    <UserLayout>
      <div>
        <div className="user_nfo_panel">
          <h1>User Information</h1>
          <div>
            <span>{name}</span>
            <span>{lastname}</span>
            <span>{email}</span>
          </div>
          <MyButton
            type="default"
            title="Edit account info"
            linkTo="/user/user_profile"
          />
        </div>

        <div className="user_nfo_panel">
          <h1>History purchases</h1>
          <div className="user_product_block_wrapper">
            <UserHistoryBlock products={history} />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
