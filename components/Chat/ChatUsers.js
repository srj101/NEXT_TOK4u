import { Avatar, List, message } from "antd";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState } from "react";
const ContainerHeight = 400;
const ChatUsers = ({ users, selectedPerson }) => {
  // console.log(users);
  return (
    <List className="cursor-pointer">
      <VirtualList
        data={users}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="email"
      >
        {(item) => (
          <List.Item
            key={item.id}
            onClick={() => selectedPerson(item)}
            className="border-b-2"
          >
            <List.Item.Meta
              avatar={<Avatar />}
              title={<div>{item.name}</div>}
              description={item.email}
            />
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};
export default ChatUsers;
