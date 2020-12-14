import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Image, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import DetailsHeader from '../components/DetailsHeader'
import ItemStats from '../components/ItemStats'
import TouchableItem from '../components/TouchableItem'
import LoadingContainer from '../components/UI/LoadingContainer'
import CustomButton from '../components/UI/CustomButton'

import myColors from '../constants/myColors'
import spacing from '../constants/spacing'
import { getSpotifyAlbumInfo, getSpotifyAlbumTracklist } from '../utils/spotify'
import { getAlbumInfo, getArtistInfo } from '../utils/lastfm'
import { abbreviateNumber } from '../utils/numbers'
import CustomText from '../components/UI/CustomText'
import DetailsTitle from '../components/DetailsTitle'
import useColorScheme from '../hooks/useColorSchemeFix'

const itemSeparator = (isDarkTheme) => (
  <View
    style={{
      height: 1,
      backgroundColor: isDarkTheme
        ? myColors.cool_gray_990
        : myColors.cool_gray_300,
    }}
  />
)

const AlbumDetailsScreen = ({ navigation, route }) => {
  const { artistName, albumName, albumArt, topPlaycount } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [albumStats, setAlbumStats] = useState()
  const [spotifyAlbumInfo, setSpotifyAlbumInfo] = useState()
  const [albumTracklist, setAlbumTracklist] = useState([])
  const [artistInfo, setArtistInfo] = useState()
  const isDarkTheme = useColorScheme() === 'dark' ? true : false
  const username = useSelector((state) => state.auth.username)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const albumStatsData = await getAlbumInfo(username, artistName, albumName)
      setAlbumStats(albumStatsData)

      const spotifyAlbumInfoData = await getSpotifyAlbumInfo(
        artistName,
        albumName
      )
      setSpotifyAlbumInfo(spotifyAlbumInfoData)

      const { tracklist } = await getSpotifyAlbumTracklist(
        artistName,
        albumName
      )
      setAlbumTracklist(tracklist)

      const artistInfoData = await getArtistInfo(username, artistName)
      setArtistInfo(artistInfoData)

      setIsLoading(false)
    }
    fetchData()
  }, [])

  const itemTrackList = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
        }}
        onPress={itemSelectTrackHandler.bind(this, item.trackName)}
      >
        <CustomText
          children={item.trackNumber}
          size="H6"
          color={isDarkTheme ? 'white' : myColors.cool_gray_900}
          bold
          complementaryStyle={{ minWidth: 25 }}
        />
        <CustomText
          children={item.trackName}
          size="H6"
          color={isDarkTheme ? 'white' : myColors.cool_gray_900}
          numberOfLines={1}
          complementaryStyle={{ flex: 1 }}
        />
        <CustomText
          children={item.duration}
          size="H6"
          color={myColors.cool_gray_500}
          complementaryStyle={{ paddingLeft: 10 }}
        />
      </TouchableOpacity>
    )
  }

  const itemSelectTrackHandler = (trackName) => {
    navigation.push('Scrobble Details', {
      artistName,
      trackName,
      albumArt,
      albumName,
    })
  }

  const itemSelectArtistHandler = () => {
    const artistImage = artistInfo.image
    const playcount = artistInfo.playcount
    const listeners = artistInfo.listeners
    navigation.navigate('Artist Details', {
      artistName,
      artistImage,
      playcount,
      listeners,
    })
  }

  const keyExtractor = useCallback((item) => item + item.id, [])

  const ListHeader = () => {
    return (
      <>
        <DetailsHeader
          title={albumName}
          subtitle={artistName}
          image={albumArt}
        />

        {spotifyAlbumInfo && !isLoading ? (
          <View>
            {albumStats && !isLoading ? (
              <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                <ItemStats
                  playcount={albumStats.playcount}
                  userplaycount={albumStats.userplaycount}
                  listeners={albumStats.listeners}
                  topPlaycount={topPlaycount}
                />
              </View>
            ) : null}

            {artistInfo && !isLoading ? (
              <View
                style={{
                  paddingHorizontal: spacing.md,
                  marginBottom: spacing.xl,
                }}
              >
                <TouchableItem onPress={itemSelectArtistHandler}>
                  <Image
                    source={{ uri: artistInfo.image }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 70,
                      marginRight: 15,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <CustomText
                      children={artistName}
                      size="H5"
                      color={isDarkTheme ? 'white' : myColors.cool_gray_900}
                      bold
                      complementaryStyle={{ marginBottom: 4 }}
                    />
                    <CustomText
                      size="H6"
                      color={
                        isDarkTheme
                          ? myColors.cool_gray_300
                          : myColors.cool_gray_600
                      }
                      numberOfLines={2}
                    >
                      {abbreviateNumber(artistInfo.playcount)} scrobbles
                    </CustomText>
                  </View>
                </TouchableItem>
              </View>
            ) : null}
            <DetailsTitle
              complementaryStyle={{
                paddingHorizontal: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: isDarkTheme
                  ? myColors.cool_gray_990
                  : myColors.cool_gray_300,
                marginBottom: 0,
                paddingBottom: spacing.md,
              }}
            >
              Tracklist
            </DetailsTitle>
          </View>
        ) : null}
      </>
    )
  }

  const ListFooter = () => {
    return (
      <View
        style={{
          paddingTop: spacing.xs,
          paddingBottom: 40,
          paddingHorizontal: spacing.md,
        }}
      >
        {spotifyAlbumInfo && !isLoading ? (
          <CustomText
            children={spotifyAlbumInfo.copyrights}
            size="H6"
            color={
              isDarkTheme ? myColors.cool_gray_400 : myColors.cool_gray_600
            }
          />
        ) : null}
      </View>
    )
  }

  const ListEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 100 }}>
          <LoadingContainer />
        </View>
      )
    }

    return (
      <View
        style={{
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CustomText
          children="Tracklist not found"
          size="H6"
          complementaryStyle={{ textAlign: 'center' }}
        />
        <CustomButton
          label="Go Back"
          onPress={() => navigation.goBack()}
          style={{ marginVertical: spacing.md }}
        />
      </View>
    )
  }

  // Set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${artistName} - ${albumName}`,
    })
  }, [navigation])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkTheme
          ? myColors.dark_gray
          : myColors.cool_gray_100,
      }}
    >
      {!isLoading ? (
        <FlatList
          data={albumTracklist}
          renderItem={itemTrackList}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSeparator.bind(this, isDarkTheme)}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          initialNumToRender={12}
        />
      ) : (
        <LoadingContainer />
      )}
    </View>
  )
}

export default AlbumDetailsScreen
