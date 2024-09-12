import LeftMenu from "@/component/LeftMenu";
import RightMenu from "@/component/rightMenu/RightMenu";
import StoryFeed from "@/component/Story/StoryFeed";
import AddPost from "@/component/feed/AddPost";
import Feed from "@/component/feed/Feed";

const Homepage = () => {
    return (
        <div className='flex gap-6 pt-6'>
            <div className="hidden xl:block w-[20%]"><LeftMenu/></div>
            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <StoryFeed />
                    <AddPost />
                    <Feed />
                </div>
            </div>
            <div className="hidden lg:block w-[30%]"><RightMenu/></div>
        </div>
    )
}

export default Homepage