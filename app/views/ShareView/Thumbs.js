import React from 'react';
import PropTypes from 'prop-types';
import {
	FlatList, Image, View, StyleSheet
} from 'react-native';
import { RectButton, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';

import { BUTTON_HIT_SLOP } from '../../containers/message/utils';
import { themes } from '../../constants/colors';
import { CustomIcon } from '../../lib/Icons';
import { isIOS } from '../../utils/deviceInfo';
import { THUMBS_HEIGHT } from './constants';
import { allowPreview } from './utils';

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
	list: {
		height: THUMBS_HEIGHT,
		paddingHorizontal: 8
	},
	videoThumbIcon: {
		position: 'absolute',
		left: 0,
		bottom: 0
	},
	removeButton: {
		position: 'absolute',
		right: 6,
		width: 28,
		height: 28,
		borderWidth: 2,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center'
	},
	removeView: {
		width: 28,
		height: 28,
		borderWidth: 2,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center'
	},
	item: {
		paddingTop: 8
	},
	thumb: {
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		borderRadius: 2,
		marginRight: 16,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1
	}
});

const ThumbButton = isIOS ? TouchableOpacity : TouchableNativeFeedback;

const Thumb = React.memo(({ item, theme, shareExtension }) => {
	const type = item?.mime;

	if (type?.match(/image/)) {
		// Disallow preview of images too big in order to prevent memory issues on iOS share extension
		if (allowPreview(shareExtension, item?.size)) {
			return (
				<Image
					source={{ uri: item.path }}
					style={[styles.thumb, { borderColor: themes[theme].borderColor }]}
				/>
			);
		} else {
			return (
				<View style={[styles.thumb, { borderColor: themes[theme].borderColor }]}>
					<CustomIcon
						name='Camera'
						size={30}
						color={themes[theme].tintColor}
					/>
				</View>
			);
		}
	}

	if (type?.match(/video/)) {
		const { uri } = item;
		return (
			<>
				<Image source={{ uri }} style={styles.thumb} />
				<CustomIcon
					name='video-1'
					size={20}
					color={themes[theme].buttonText}
					style={styles.videoThumbIcon}
				/>
			</>
		);
	}

	// Multiple files selection (not audio or video) is not implemented, so there's no thumb
	return null;
});
Thumb.propTypes = {
	item: PropTypes.object,
	theme: PropTypes.string,
	shareExtension: PropTypes.bool
};

const Thumbs = React.memo(({
	attachments, theme, shareExtension, onPress, onRemove
}) => {
	if (attachments?.length > 1) {
		return (
			<FlatList
				horizontal
				data={attachments}
				keyExtractor={item => item.path}
				renderItem={({ item }) => (
					<ThumbButton style={styles.item} onPress={() => onPress(item)} activeOpacity={0.7}>
						<>
							<Thumb
								item={item}
								theme={theme}
								shareExtension={shareExtension}
							/>
							<RectButton
								hitSlop={BUTTON_HIT_SLOP}
								style={[styles.removeButton, { backgroundColor: themes[theme].bodyText, borderColor: themes[theme].auxiliaryBackground }]}
								activeOpacity={1}
								rippleColor={themes[theme].bannerBackground}
								onPress={() => onRemove(item)}
							>
								<View style={[styles.removeView, { borderColor: themes[theme].auxiliaryBackground }]}>
									<CustomIcon
										name='Cross'
										color={themes[theme].backgroundColor}
										size={14}
									/>
								</View>
							</RectButton>
						</>
					</ThumbButton>
				)}
				style={[styles.list, { backgroundColor: themes[theme].messageboxBackground }]}
			/>
		);
	}
});
Thumbs.propTypes = {
	attachments: PropTypes.array,
	theme: PropTypes.string,
	shareExtension: PropTypes.bool,
	onPress: PropTypes.func,
	onRemove: PropTypes.func
};

export default Thumbs;
