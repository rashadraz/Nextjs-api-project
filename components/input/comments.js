import { useContext, useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";
function Comments(props) {
	const { eventId } = props;

	const notificationCtx = useContext(NotificationContext);

	const [showComments, setShowComments] = useState(false);

	const [comments, setComments] = useState([]);

	const [isFetchingComments , setIsFetchingComments] = useState(false);

	useEffect(() => {
		if (showComments) {
			setIsFetchingComments(true);
			fetch("/api/comments/" + eventId)
				.then((response) => response.json())
				.then((data) => {
					if (data.comments) setComments(data.comments);
					else console.log(data);
					setIsFetchingComments(false);
				});
		}
	}, [showComments]);

	function toggleCommentsHandler() {
		setShowComments((prevStatus) => !prevStatus);
	}

	function addCommentHandler(commentData) {
		notificationCtx.showNotification({
			title: "Sending Comment",
			message: "Your Comment is Currently Being Stored into a database",
			status: "success",
		});
		// send data to API
		fetch("/api/comments/" + eventId, {
			method: "POST",
			body: JSON.stringify(commentData),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return response.json().then((data) => {
					throw new Error(data.message || "Something went Wrong");
				});
			})
			.then((data) => {
				notificationCtx.showNotification({
					title: "Success!!",
					message: "Your Comment Was Saved",
					status: "pending",
				});
			})
			.catch((error) => {
				notificationCtx.showNotification({
					title: "Error!!",
					message: error.message || "Your Comment Was Saved",
					status: "error",
				});
			});
	}

	return (
		<section className={classes.comments}>
			<button onClick={toggleCommentsHandler}>
				{showComments ? "Hide" : "Show"} Comments
			</button>
			{showComments && <NewComment onAddComment={addCommentHandler} />}
			{showComments && !isFetchingComments && <CommentList items={comments} />}
			{showComments && isFetchingComments && <p>Loading...</p>}

		</section>
	);
}

export default Comments;
