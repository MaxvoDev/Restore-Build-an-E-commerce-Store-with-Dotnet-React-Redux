import { List, ListItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/basket/AccountSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { setBasket } from "../../features/basket/BasketSlice";

interface Props {
    navStyles: Object;
}

const userMenu = [
    {
        title: 'Sign In',
        path: '/signin'
    }
]

export default function UserMenu({ navStyles }: Props) {
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function GuessMenu() {
        return (
            <List sx={{ display: 'flex' }}>
                <ListItem
                    sx={navStyles}
                    component="a"
                    href="#">
                    {user?.email}
                </ListItem>

                <ListItem
                    sx={navStyles}
                    component="a"
                    href="#"
                    onClick={() => handleSignout()}>
                    Sign Out
                </ListItem>
            </List>

        )
    }

    function MemberMenu() {
        return (
            <List sx={{ display: 'flex' }}>
                {userMenu.map(({ title, path }) => (
                    <ListItem key={path}
                        component={NavLink}
                        to={path}
                        sx={navStyles}
                    >
                        {title.toUpperCase()}
                    </ListItem>
                ))}
            </List >
        )
    }

    async function handleSignout() {
        await dispatch(signOut());
        await dispatch(setBasket(null));
        navigate('/catalog');
    }

    return (
        <>
            { user ? <GuessMenu /> : <MemberMenu /> }
        </>
    )
}