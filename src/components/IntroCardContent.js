import { CardContent, Typography } from "@mui/material";
import { Fragment } from "react";

export const IntroCardContent = (
    <Fragment>
        <CardContent>
            <Typography variant="h5" component="div" className="welcome">
                Welcome to Ford Chat! 👋
            </Typography>
            <Typography variant="body2" className="introduction">
                I am a chatbot that can answer any questions you have about Ford vehicles. I can help you with the following:
                <br />
                <ul>
                    <li>Get information about a specific model</li>
                    <li>Find nearby dealerships to schedule a test drive</li>
                    <li>Get redirected to a relevant payments estimator</li>
                </ul>
            </Typography>
        </CardContent>
    </Fragment>
);