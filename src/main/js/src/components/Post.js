import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Divider, Typography} from "@mui/material";

function Post({post, getComments, comments, setComments}) {
    const [seeComments, setSeeComments] = useState(false)

    const handleSeeComments = (id) => {
        getComments(id)
        setSeeComments(true)
    }

    const handleHideComments = () => {
        setSeeComments(false)
    }

    return (
        <>
            <Card sx={{marginTop: '16px'}} key={post.id}>
                <CardContent>
                    <Typography variant="caption" color="text.secondary">#{post.id}</Typography>
                    <Divider />
                    <Typography mt="1rem" variant="body1">{post.content}</Typography>

                </CardContent>
                <CardActions>
                    <Box width="100%" display="flex" justifyContent={post.wasCommented?.length > 0 ? "space-between" : "flex-end"} alignItems="center">
                    {post.wasCommented?.length > 0 && !seeComments && <Button onClick={() => handleSeeComments(post.id)}>Zobacz komentarze</Button>}
                    {post.wasCommented?.length > 0 && seeComments && <Button onClick={handleHideComments}>Schowaj komentarze</Button>}
                    <Box>
                        <Typography variant="caption">{post.author}&ensp;&bull;</Typography>
                        <Typography variant="caption" color="text.secondary">&ensp;{new Date(post.creationDate).toLocaleString()}</Typography>
                    </Box>
                    </Box>
                </CardActions>
            </Card>
            {seeComments && post.wasCommented?.length > 0 && post.wasCommented.map(comment => <Box ml={4}><Post post={comment} getComments={getComments} comments={comments} setComments={setComments} /></Box>)}
        </>
    );
}

export default Post;