import React, { useState, useEffect, Fragment, useRef } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import { Select, Form, Input, Radio, Space } from "antd";

// import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Divider, List, Typography } from 'antd';

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function youtubeApiSettings() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState();
  const [engineer, setEngineer] = useState();
  const [email, setEmail] = useState("");

  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [users, setUsers] = useState([]);

  const data = [
    'embed the video in the tickets.',
    'CreatedAt',
    'updatedAt',
    'customizable generated post status (published, draft, pending, private, trash)',
    'limited video long and weight',
    'import comments from the YouTube video directly to your generated blog post',
    'Maximum/minimum title length post limitation Maximum/minimum content length post limitation',
    'automatically generate post categories or tags from marketplace',
    'items manually add post categories or tags to items grab videos localized by address or coordinates select source language',
    'generate post or page YouTube video player customizations: width, height, theme color, show captions, video controls, allow full screen, loop video, auto start video, select player language',
    'compress the video before upload',
    
  ];
  return (
    <>
      <div>
        <div>
          <h1 className="text-xl text-center m2 p2 font-bold">
            Youtube API Settings
          </h1>
          <h6 className="text-xs font-normal text-gray-900">
            All fields are required!
          </h6>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              id="name"
              placeholder="Enter Client ID
              here......"
              name="name"
              onChange={(e) => setName(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <input
              type="text"
              name="email"
              placeholder="Enter Client secret here...."
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <input
              type="text"
              name="title"
              placeholder="Channel Name"
              maxLength={64}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="title"
              placeholder="playlist"
              maxLength={64}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <div className="flex justify-center mx-auto">
              <Radio.Group
                buttonStyle="solid"
                onChange={(e) => setPriority(e.target.value)}
                className="mx-auto justify-center space-x-4"
              >
                <Radio.Button value="Low">Private</Radio.Button>
                <Radio.Button value="Normal">public</Radio.Button>
                <Radio.Button value="High" className="bg-red">
                  link for who get it
                </Radio.Button>
              </Radio.Group>
            </div>
            <>
    <Divider orientation="left">Todo</Divider>
    <List

      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text mark>[*]</Typography.Text> {item}
        </List.Item>
      )}
    />
    
  </>
            <MDEditor
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              preview="edit"
            />
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense mx-auto ">
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className="w-1/2 mx-auto  inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 hover:bg-indigo-600 cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className="mt-3 w-1/2  mx-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
