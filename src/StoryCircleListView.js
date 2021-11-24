import React, { Component } from "react";
import { View, FlatList } from "react-native";
import StoryCircleListItem from "./StoryCircleListItem";

class StoryCircleListView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			data,
			handleStoryItemPress,
			unPressedBorderColor,
			pressedBorderColor,
			avatarSize,
		} = this.props;

		return (
			<View>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={data}
					horizontal
					style={{ paddingLeft: 12 }}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					ListFooterComponent={<View style={{ flex: 1, width: 8 }} />}
					renderItem={({ item, index }) => {
						const props = {
							avatarSize,
							handleStoryItemPress: () =>
								handleStoryItemPress && handleStoryItemPress(item, index),
							unPressedBorderColor,
							pressedBorderColor,
							item,
						};
						if (this.props.customAvatarComponent) {
							return <this.props.customAvatarComponent {...props} />;
						} else {
							return <StoryCircleListItem {...props} />;
						}
					}}
				/>
			</View>
		);
	}
}

export default StoryCircleListView;
