import { Post as PostType, User, Like } from "@prisma/client";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";
import UserInfo from "@/component/feed/UserInfor";
import { Card } from "@/components/ui/card";
import PostClientWrapper from "@/component/feed/PostClientWrapper";
import { formatInTimeZone } from 'date-fns-tz';

type FeedPostType = PostType & {
    user: User;
    likes: (Like & { user: User })[];
};

const Post = ({ post }: { post: FeedPostType }) => {
    const { userId } = auth();
    const isAdmin = userId === 'user_2kyEFBJyLszkG66jjaEO3ryToc7';

    const formattedEventTime = post.eventStartTime
        ? formatInTimeZone(new Date(post.eventStartTime), 'Australia/Melbourne', "yyyy-MM-dd HH:mm:ss")
        : null;

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <div className="flex items-center justify-between m-4">
                    <UserInfo
                        userId={post.user.id}
                        username={post.user.username}
                        name={post.user.name}
                        surname={post.user.surname}
                        avatar={post.user.avatar}
                    />
                    {userId === post.user.id && <PostInfo
                        postId={post.id}
                        isAdmin={isAdmin}
                        initialIsLikeDisabled={post.isLikeDisabled}
                        post={{
                            id: post.id,
                            title: post.title,
                            desc: post.desc,
                            eventStartTime: post.eventStartTime,
                            penaltyAmount: post.penaltyAmount
                        }}
                    />}
                </div>
                <PostClientWrapper
                    postId={post.id}
                    likes={post.likes}
                    isLikeDisabled={post.isLikeDisabled}
                    userId={userId}
                    title={post.title}
                    description={post.desc}
                    formattedEventTime={formattedEventTime}
                    pitchLocation={{lat: -37.8117104, lng: 144.9722086}}
                />
            </Card>
        </div>
    );
};

export default Post;