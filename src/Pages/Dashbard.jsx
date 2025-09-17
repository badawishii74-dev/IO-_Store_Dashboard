import TopBar from "../Components/Bars/TopBar"
import SideBar from "../Components/Bars/SideBar"
import { Outlet } from 'react-router-dom'

export default function Dashboard() {
    return (
        <div className='relative'>
            <TopBar />
            <div className="flex gap-1 mt-[70px]">
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}