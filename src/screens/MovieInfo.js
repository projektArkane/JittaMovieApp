import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import React, {useState, useCallback, useRef} from 'react';
import {Button, Alert} from 'react-native';
import Mcon from 'react-native-vector-icons/dist/MaterialIcons';
import F5con from 'react-native-vector-icons/dist/FontAwesome5';
import Fcon from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigation} from '@react-navigation/native';

// import YoutubePlayer from 'react-native-youtube-iframe';

const jsonget = async url => {
  let fetchRes = await fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
  });
  return await fetchRes.json();
};

const makechatapicall = async () => {
  let res = await jsonget(
    `https://api.themoviedb.org/3/trending/all/week?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
  );
  console.log('RES.#', res.results[0]);
};

const CastItem = ({title, url}) => (
  <View style={{marginTop: 17}}>
    <View
      style={{
        marginRight: 13,
      }}>
      <Image
        style={{
          height: 72,
          width: 72,
          borderRadius: 12,
          backgroundColor: '#D3D3D3',
        }}
        source={{
          uri: `https://image.tmdb.org/t/p/w92${url}`,
        }}
      />
    </View>
    <Text style={{width: 72, color: 'black', fontSize: 12, marginTop: 8}}>
      {title}
    </Text>
  </View>
);

const MovieInfo = props => {
  const movie_id = props.route.params.id;
  const [movieData, setMovieData] = React.useState('');
  const [title, setTilte] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [runtime, setRuntime] = React.useState(null);
  const [language, setLanguage] = React.useState(null);
  const [genres, setGenres] = React.useState(null);
  const [cast, setCast] = React.useState(null);
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = React.useState(null);
  const [video_url, setVideo] = React.useState(null);
  const [popularity, setPoularity] = React.useState(null);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const renderItem = ({item}) => (
    <CastItem title={item.name} url={item.profile_path} />
  );

  const getmoviedetails = async () => {
    let res = await jsonget(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
    );
    console.log('RES2', res);
    setPoster(res.poster_path);
    setTilte(res.original_title);
    setDescription(res.overview);
    setRuntime(res.runtime);
    setLanguage(res.spoken_languages); //showing only one languge as of now
    setGenres(res.genres);
    setPoularity(res.vote_average);
  };

  const convertMinToHourMin = totalMinutes => {
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getCastDetails = async () => {
    let res = await jsonget(
      `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
    );
    console.log('CAST', res.cast);
    setCast(res.cast);
  };

  const getMovieVideos = async () => {
    let res = await jsonget(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
    );
    console.log('VIDEOS', res);
    setVideo(res.results[0].key);

    //   setCast(res.cast);
  };

  React.useEffect(() => {
    // makechatapicall();
    getmoviedetails();
    getCastDetails();
    getMovieVideos();
  }, []);
  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {/* Movie video */}
      <View style={{backgroundColor: 'grey', width: '100%'}}>
        {/* <YoutubePlayer
            height={200}
            play={playing}
            videoId={"96oC5P4MRqQ"}
            onChangeState={onStateChange}
          />
          <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
        <Image
          style={{height: 250, width: '100%'}}
          resizeMode={'cover'}
          source={{
            uri: `https://image.tmdb.org/t/p/original${poster}`,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 250,
            top: 0,
            backgroundColor: 'black',
            opacity: 0.3,
          }}></View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            console.log('VIDEO URL', video_url);
            Linking.openURL(`https://www.youtube.com/watch?v=${video_url}`);
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            backgroundColor: 'white',
            position: 'absolute',
            top: 250 / 2 - 25,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <F5con
            style={{paddingLeft: 3}}
            name="play"
            size={20}
            color={'black'}
          />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            top: 250 / 2 + 30,
            alignSelf: 'center',
          }}>
          <Text style={{color: 'white'}}>Play Trailer</Text>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 25,
            left: 20,
          }}>
          <Mcon name="keyboard-backspace" size={25} color={'white'} />
        </Pressable>
      </View>

      {/* description + cast */}
      <View style={{backgroundColor: 'white', flex: 1}}>
        {/* DESCRIPTION */}
        <View
          style={{
            flex: 3.4 / 5,
            // backgroundColor: 'yellow',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              fontSize: 20,

              marginTop: 24,
              color: 'black',
            }}>
            {title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 16,
            }}>
            <Fcon
              name={'star'}
              color={'#F2A230'}
              size={12}
              style={{marginRight: 6}}
            />
            <Text style={{color: '#9C9C9C', fontSize: 12}}>
              {popularity?.toFixed(1)}/10 TMDb
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 20, width: '100%'}}>
            <ScrollView horizontal>
              {genres?.map(x => {
                return (
                  <Text
                    style={{
                      marginRight: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      backgroundColor: '#DBE3FF',
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: '#88A4E8',
                    }}
                    key={x.id}>
                    {x.name.toUpperCase()}
                  </Text>
                );
              })}
            </ScrollView>
          </View>
          {/* 3 BOXES */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={{color: '#9C9C9C', fontSize: 12}}>Lenght</Text>
              <Text style={{color: 'black', fontSize: 12, marginTop: 4}}>
                {convertMinToHourMin(runtime)}
              </Text>
            </View>
            <View>
              <Text style={{color: '#9C9C9C', fontSize: 12}}>Language</Text>
              <View style={{flexDirection: 'row'}}>
                {language?.map(x => {
                  return (
                    <Text
                      style={{
                        paddingRight: 5,
                        color: 'black',
                        fontSize: 12,
                        marginTop: 4,
                      }}
                      key={x.id}>
                      {x.name}
                    </Text>
                  );
                })}
              </View>
            </View>
            <View>
              <Text>Lenght</Text>
              <Text>Lenght</Text>
            </View>
          </View>

          {/* DESC */}
          <Text
            style={{
              marginTop: 24,
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Description
          </Text>
          <View style={{height: '100%'}}>
            <ScrollView>
              <Text
                style={{
                  fontSize: 12,
                  color: '#9C9C9C',
                  lineHeight: 22,
                  marginTop: 8,
                  height: 110,
                }}>
                {description}
              </Text>
            </ScrollView>
          </View>
        </View>

        {/* CAST */}
        <View style={{flex: 1.6 / 5}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
              paddingLeft: 20,
            }}>
            Cast
          </Text>
          <View style={{paddingLeft: 20}}>
            <FlatList
              horizontal={true}
              data={cast}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              // initialNumToRender={30}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovieInfo;
