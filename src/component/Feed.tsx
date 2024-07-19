import React from 'react';
import Post from "@/component/Post";

const Feed = () => {
    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg gap-12'}>
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />

        </div>
    );
};

export default Feed;