import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import Fcon from 'react-native-vector-icons/dist/FontAwesome';
import Fcon2 from 'react-native-vector-icons/dist/Feather';
import {useNavigation} from '@react-navigation/native';

const logOff = () => {
  //function to log Out from app
  console.log('RED');
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

const jsonget = async url => {
  //function to get data
  let fetchRes = await fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
  });
  return await fetchRes.json();
};

const MovieItem = ({title, url, popularity, votes, movie_id}) => {
  const navigation = useNavigation();
  console.log('ID', movie_id);
  return (
    <Pressable
      onPress={() => {
        console.log('PRessed');
        navigation.navigate('movieInfo', {id: movie_id});
      }}
      style={Styles.movieItem1}>
      <Image
        style={Styles.movieItem1Image}
        source={{
          uri: `https://image.tmdb.org/t/p/w342${url}`,
        }}
      />
      <View style={{width: 143, marginTop: 12}}>
        <Text style={{color: '#1E2228'}}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Fcon
            name={'star'}
            color={'#F2A230'}
            size={12}
            style={{marginRight: 6}}
          />
          <Text style={{color: '#9C9C9C', fontSize: 12}}>
            {popularity.toFixed(1)}/10 TMDb
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const MovieItem2 = ({
  title,
  url,
  popularity,
  votes,
  genre_ids,
  genre_list,
  movie_id,
}) => {
  // find geners name from id
  const navigation = useNavigation();
  let final_list = [];
  genre_ids?.map(x => {
    genre_list?.map(y => {
      if (y.id === x) {
        final_list.push({id: y.id, name: y.name});
      }
    });
  });

  return (
    <Pressable
      onPress={() => {
        console.log('PRessed');
        navigation.navigate('movieInfo', {id: movie_id});
      }}
      style={{marginBottom: 20, marginLeft: 20, flexDirection: 'row'}}>
      <Image
        style={Styles.movieItem2Image}
        source={{
          uri: `https://image.tmdb.org/t/p/w342${url}`,
        }}
      />
      <View style={{width: 143, marginLeft: 20}}>
        <Text style={{color: '#1E2228'}}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Fcon
            name={'star'}
            color={'#F2A230'}
            size={12}
            style={{marginRight: 6}}
          />
          <Text style={{color: '#9C9C9C', fontSize: 12}}>
            {popularity.toFixed(1)}/10 TMDb
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            marginTop: 10,
            width: 250,
          }}>
          <ScrollView horizontal>
            {final_list?.map(x => {
              return (
                <Text style={Styles.genrepill} key={x.id}>
                  {x.name.toUpperCase()}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Pressable>
  );
};

const renderItem = ({item}) => (
  <MovieItem
    title={item.original_title}
    url={item.poster_path}
    popularity={item.vote_average}
    votes={item.vote_count}
    movie_id={item.id}
  />
);

const HomeScreen = ({navigation}) => {
  const [showingList, setShowingList] = React.useState('');
  const [trendingMovies, setTrendingMovies] = React.useState(null);
  const [genersList, setGenresList] = React.useState(null);

  const renderItem2 = ({item}) => (
    <MovieItem2
      title={item.original_title}
      url={item.poster_path}
      popularity={item.vote_average}
      votes={item.vote_count}
      genre_ids={item.genre_ids}
      genre_list={genersList}
      movie_id={item.id}
    />
  );

  const MovieNowShowing = async (text, page) => {
    //api call function for now showing movie list
    let res = await jsonget(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US&page=1`,
    );
    console.log('SEARCH', res.results);
    setShowingList(res.results);
  };

  const getTrendingMovieList = async () => {
    //api call function for trending movie list
    let res = await jsonget(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
    );
    console.log('TRENDING', res);
    setTrendingMovies(res.results);
    // setLoading(false);
  };

  const getGenreList = async () => {
    //api call function for genre list
    let res = await jsonget(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US`,
    );
    setGenresList(res.genres);
    console.log('LIST_JITTA', res);
  };

  React.useEffect(() => {
    MovieNowShowing();
    getTrendingMovieList();
    getGenreList();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        animated={true}
        backgroundColor="#EFEFF0"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={Styles.header}>
        <Fcon2 name={'menu'} color={'black'} size={18} />
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          Film Ku
        </Text>
        <Fcon2
          onPress={() => {
            logOff();
          }}
          name={'power'}
          color={'black'}
          size={18}
        />
      </View>

      <View style={{flex: 1}}>
        <View style={{flex: 1 / 2}}>
          <Text style={Styles.title}>Now Showing</Text>

          <FlatList
            data={showingList}
            horizontal
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{flex: 1 / 2}}>
          <Text style={{...Styles.title, marginTop: 24}}>Popular</Text>
          <FlatList
            data={trendingMovies}
            renderItem={renderItem2}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const Styles = StyleSheet.create({
  movieItem1Image: {
    height: 212,
    width: 143,
    borderRadius: 8,
    elevation: 5,
    shadowColor: 'black',
  },
  movieItem1: {
    marginBottom: 20,
    marginLeft: 20,
    width: 143,
    height: 212,
  },
  movieItem2Image: {
    height: 128,
    width: 85,
    borderRadius: 8,
    elevation: 5,
    shadowColor: 'black',
  },
  genrepill: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#DBE3FF',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#88A4E8',
  },
  header: {
    backgroundColor: 'white',
    height: 60,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
});
