import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import UserSelect from "./UserSelect";
import Post from "./Post";
import logo from "../img/bird.png"

//Designed by vectorstock (Image #35521609 at VectorStock.com)

function Dashboard() {
    const [userName, setUserName] = useState('')
    const [users, setUsers] = useState([])
    const [friend1, setFriend1] = useState("")
    const [friend2, setFriend2] = useState("")
    const [friends, setFriends] = useState([])
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState('')
    const [creator, setCreator] = useState('')
    const [commentId, setCommentId] = useState('')
    const [comments, setComments] = useState({mainId: 0, posts: []})
    const [loadingPosts, setLoadingPosts] = useState(false)
    const [loadingFriends, setLoadingFriends] = useState(false)

    const getUsers = () => {
        fetch("http://localhost:8080/users")
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .catch(err => console.error(err))
    }

    const saveUser = (event) => {
        console.log("save", event.target.value, userName)
        if (userName) {
            fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: userName,
            }).then(() => getUsers())
        }
    }

    const saveFriendship = () => {
        console.log(friend1, friend2)
        if (friend1 && friend2) {
            fetch("http://localhost:8080/users/friends", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify([friend1, friend2])
            }).then(() => {
                setFriend1('')
                setFriend2('')
            })
                .then(() => getUsers())
                .catch(err => console.error(err))
        }
    }

    const getFriends = (userName) => {
        setLoadingFriends(true)
        fetch('http://localhost:8080/users/friends?' + new URLSearchParams({userName}))
            .then(res => res.json())
            .then(data => setFriends(data.users))
            .then(() => setLoadingFriends(false))
            .catch(err => console.error(err))
    }

    const getPosts = (user) => {
        setLoadingPosts(true)
        fetch('http://localhost:8080/posts?' + new URLSearchParams({userName: user}))
            .then(res => res.json())
            .then(data => setPosts(data.posts))
            .then(() => setLoadingPosts(false))
            .catch(err => console.error(err))
    }

    const savePost = () => {
        fetch('http://localhost:8080/posts', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                content,
                userName: creator,
                commentId
            })
        }).then(() => {
            console.log("after fetch")
            setContent('')
            setCreator('')
            setCommentId('')
        })
    }

    const getComments = (id) => {
        fetch('http://localhost:8080/posts/comments?' + new URLSearchParams({id}))
            .then(res => res.json())
            .then(data => setComments({mainId: id, posts: data.posts}))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        setComments({mainId: 0, posts: []})
        console.log(posts)
    }, [posts])

    return (
        <>
            <AppBar>
                <Toolbar>
                    <img src={logo} alt="logo" width="48px" height="48px"/>
                    <Typography variant="h4" component="div" ml={2} sx={{ flexGrow: 1 }}>Bird app</Typography>
                </Toolbar>
            </AppBar>
            <Grid component="div" container spacing={4} pt={10} pl={2} pr={2} pb={2}>
                <Grid container spacing={4} item md={4}>
                    <Grid item md={12}>
                        <Typography variant="h6">Dodaj znajomość pomiędzy:</Typography>
                        <Box component="form" onSubmit={saveFriendship} display="flex" flexDirection="column" gap={2}>
                            <Select
                                value={friend1}
                                onChange={event => setFriend1(event.target.value)}
                            >
                                <MenuItem value="" selected>Brak</MenuItem>
                                {users && users.map(user => (
                                    <MenuItem key={user.userName} value={user.userName}>{user.userName}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                value={friend2}
                                onChange={event => setFriend2(event.target.value)}
                            >
                                <MenuItem value="" selected>Brak</MenuItem>
                                {users && users.map(user => (
                                    <MenuItem key={user.userName} value={user.userName}>{user.userName}</MenuItem>
                                ))}
                            </Select>
                            <Button type="submit" onClick={saveFriendship}>Dodaj znajomość</Button>
                        </Box>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant="h6">Dodaj użytkownika</Typography>
                        <Box component="form" display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Nazwa użytkownika"
                                value={userName}
                                onChange={event => setUserName(event.target.value)}
                            />
                            <Button type="submit" onClick={saveUser}>Dodaj</Button>
                        </Box>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant="h6">Dodaj post</Typography>
                        <Box component="form" onSubmit={savePost} display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Treść"
                                value={content}
                                onChange={event => setContent(event.target.value)}
                                multiline
                                fullWidth
                                rows={5}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="post-user-label">Użytkownik</InputLabel>
                                <Select
                                    label="Użytkownik"
                                    labelId="post-user-label"
                                    value={creator}
                                    onChange={event => setCreator(event.target.value)}
                                >
                                    <MenuItem value="" selected>Brak</MenuItem>
                                    {users && users.map(user => (
                                        <MenuItem key={user.userName} value={user.userName}>{user.userName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="post-comment-label">Komentarz do</InputLabel>
                                <Select
                                    label="Komentarz do"
                                    labelId="post-comment-label"
                                    onChange={event => setCommentId(event.target.value)}
                                >
                                    <MenuItem value="" selected>Brak</MenuItem>
                                    {posts && posts.map(post => (
                                        <MenuItem key={post.id} value={post.id}>{post.id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button onClick={savePost}>Dodaj</Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item md={4}>
                    <Grid item md={12}>
                        <Typography variant="h6">Wszyscy użytkownicy</Typography>
                        <List sx={{maxHeight: "60%"}}>
                            {users && users.map(user => (
                                <ListItem key={user.userName}>
                                    <ListItemText primary={user.userName} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item md={12}  display="flex" flexDirection="column">
                        <Typography variant="h6">Znajomi użytkownika:</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="friends-label">Użytkownik</InputLabel>
                            <Select
                                label="Użytkownik"
                                labelId="friends-label"
                                // value={friend2}
                                onChange={event => getFriends(event.target.value)}
                            >
                                <MenuItem value="" selected>Brak</MenuItem>
                                {users && users.map(user => (
                                    <MenuItem key={user.userName} value={user.userName}>{user.userName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {loadingFriends ?
                            <Box display="flex" justifyContent="center" mt="16px"><CircularProgress/></Box> :
                            <List>
                                {friends && friends.map(user => (
                                    <ListItem key={user.userName}>
                                        <ListItemText primary={user.userName}/>
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </Grid>
                </Grid>
                <Grid item md={4}>
                    <Typography variant="h6">Posty użytkownika:</Typography>
                    <UserSelect users={users} func={getPosts} />
                    {loadingPosts ? <Box display="flex" justifyContent="center" mt="16px"><CircularProgress/> </Box>: <>
                        {posts && posts.map(post => (
                            <Post key={post.id} post={post} getComments={getComments} comments={comments}
                                  setComments={setComments}/>
                        ))}
                    </>}
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;