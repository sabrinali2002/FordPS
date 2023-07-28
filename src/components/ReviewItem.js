import React, { Fragment } from "react";
import { Rating, Box, LinearProgress, Typography, Grid, Stack, Avatar, Divider } from "@mui/material";

export default function ReviewItem({ date, star, name, review }) {
    return (
        <Fragment>
            <Box display="flex" flexDirection="row" marginTop="10px">
                <Box display="flex" flexDirection="column" alignItems="center" width="10%">
                    <Avatar sx={{ width: 50, height: 50 }}>{name.charAt(0)}</Avatar>
                    <p style={{ fontSize: "1rem" }}>{name}</p>
                </Box>
                <Box display="flex" flexDirection="column" width="90%">
                    <Box display="flex" gap="1rem">
                        <Rating readOnly value={star} />
                        <p style={{ fontSize: "1rem" }}>Reviewed {date}</p>
                    </Box>
                    <p>{review}</p>
                </Box>
            </Box>
            <Divider sx={{ borderBottomWidth: 3 , background:"black", width:"95%"}}/>
        </Fragment>
    );
}
