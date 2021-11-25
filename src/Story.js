import React, { Fragment, useRef, useState } from "react";
import { LogBox, Dimensions, View, Platform, StatusBar } from "react-native";
import Modal from "react-native-modalbox";
import StoryListItem from "./StoryListItem";
import StoryCircleListView from "./StoryCircleListView";
import { isNullOrWhitespace } from "./helpers/ValidationHelpers";
import type { IUserStory } from "./interfaces/IUserStory";
import AndroidCubeEffect from "./AndroidCubeEffect";
import CubeNavigationHorizontal from "./CubeNavigationHorizontal";

type Props = {
	data: IUserStory[],
	style?: any,
	unPressedBorderColor?: string,
	pressedBorderColor?: string,
	onClose?: function,
	onStart?: function,
	duration?: number,
	swipeText?: string,
	customSwipeUpComponent?: any,
	customCloseComponent?: any,
	customAvatarComponent?: any,
	avatarSize?: number,
};

LogBox.ignoreLogs(["Warning: componentWillReceiveProps"]); // Ignore log notification by message

export const Story = (props: Props) => {
	const {
		data,
		unPressedBorderColor,
		pressedBorderColor,
		style,
		onStart,
		onClose,
		duration,
		swipeText,
		customSwipeUpComponent,
		customCloseComponent,
		avatarSize,
	} = props;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [selectedData, setSelectedData] = useState([]);
	const cube = useRef();

	// Component Functions
	const _handleStoryItemPress = (item, index) => {
		const newData = data.slice(index);
		if (onStart) {
			onStart(item);
		}

		setCurrentPage(0);
		setSelectedData(newData);
		setIsModalOpen(true);
	};

	function onStoryFinish(state) {
		if (!isNullOrWhitespace(state)) {
			if (state == "next") {
				const newPage = currentPage + 1;
				if (newPage < selectedData.length) {
					setCurrentPage(newPage);
					cube?.current?.scrollTo(newPage);
				} else {
					setIsModalOpen(false);
					setCurrentPage(0);
					if (onClose) {
						onClose(selectedData[selectedData.length - 1]);
					}
				}
			} else if (state == "previous") {
				const newPage = currentPage - 1;
				if (newPage < 0) {
					setIsModalOpen(false);
					setCurrentPage(0);
				} else {
					setCurrentPage(newPage);
					cube?.current?.scrollTo(newPage);
				}
			}
		}
	}

	const renderStoryList = () =>
		selectedData.map((x, i) => {
			return (
				<StoryListItem
					customHeaderComponent={props.customHeaderComponent}
					duration={duration * 1000}
					key={i}
					profileName={x.user_name}
					profileImage={x.user_image}
					stories={x.stories}
					currentPage={currentPage}
					onFinish={onStoryFinish}
					swipeText={swipeText}
					customSwipeUpComponent={customSwipeUpComponent}
					customCloseComponent={customCloseComponent}
					onClosePress={() => {
						setIsModalOpen(false);
						if (onClose) {
							onClose(x);
						}
					}}
					index={i}
					header
				/>
			);
		});

	const renderCube = () => {
		if (Platform.OS == "ios") {
			return (
				<CubeNavigationHorizontal
					ref={cube}
					callBackAfterSwipe={(x) => {
						if (x != currentPage) {
							setCurrentPage(parseInt(x));
						}
					}}
				>
					{renderStoryList()}
				</CubeNavigationHorizontal>
			);
		} else {
			return (
				<AndroidCubeEffect
					ref={cube}
					callBackAfterSwipe={(x) => {
						if (x != currentPage) {
							setCurrentPage(parseInt(x));
						}
					}}
				>
					{renderStoryList()}
				</AndroidCubeEffect>
			);
		}
	};

	return (
		<Fragment>
			<View style={style}>
				<StoryCircleListView
					handleStoryItemPress={_handleStoryItemPress}
					data={data}
					avatarSize={avatarSize}
					unPressedBorderColor={unPressedBorderColor}
					pressedBorderColor={pressedBorderColor}
					customAvatarComponent={props.customAvatarComponent}
				/>
			</View>
			<Modal
				style={{ height: "100%", backgroundColor: "black" }}
				isOpen={isModalOpen}
				onClosed={() => setIsModalOpen(false)}
				position='center'
				swipeToClose
				swipeArea={250}
				backButtonClose
				coverScreen={true}
			>
				<StatusBar
					backgroundColor={"rgba(0,0,0,0.9)"}
					barStyle={"light-content"}
				/>
				{renderCube()}
			</Modal>
		</Fragment>
	);
};
export default Story;
