import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Image} from 'react-native-elements';
import {SearchBar} from 'react-native-elements';
import debounce from 'lodash.debounce';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const jsonget = async url => {
  //get api call function
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
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('movieInfo', {id: movie_id});
      }}
      style={{flexDirection: 'row', marginBottom: 20}}>
      <Image
        style={{height: 72, width: 72, borderRadius: 10}}
        source={{
          uri: `https://image.tmdb.org/t/p/w154${url}`,
        }}
      />
      <View style={{marginLeft: 20}}>
        <Text style={{color: '#1E2228'}}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
          }}>
          <FontAwesome
            name={'star'}
            color={'#F2A230'}
            size={12}
            style={{marginRight: 6}}
          />
          <Text style={{color: '#9C9C9C', fontSize: 12}}>
            {popularity.toFixed(1)}/10 TMDb
          </Text>
        </View>
        <Text style={{color: '#9C9C9C', marginTop: 4}}>votes: {votes}</Text>
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

const SearchScreen = () => {
  const [trendingMovies, setTrendingMovies] = React.useState(null);
  const [value, setValue] = useState(''); //seacrch text before debounce
  const [dbValue, saveToDb] = useState(''); // would be an API call normally
  const [loading, setLoading] = useState(false); //search bar loader
  const [refreshing, setRefreshing] = React.useState(true); //pull to refresh state
  const [responseEmpty, setResponseEmpty] = React.useState(false); //if the api call responseisempty or not
  const [trendingMoviePage, setTrendingMoviesPage] = useState(1); //page count
  const [listLoading, setListLoading] = React.useState(false); //flatlist loader state

  const SearchMovieName = async (text, page) => {
    //serach movie name with query
    let res = await jsonget(
      `https://api.themoviedb.org/3/search/movie?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US&query=${text}&page=${page}include_adult=false`,
    );
    console.log('SEARCH', res);
    setTrendingMovies(res.results);
    setLoading(false);
  };

  const debouncedSave = useRef(
    //debounce function
    debounce(nextValue => saveToDb(nextValue), 200),
  ).current;

  const getTrendingMovieList = async page => {
    //api call for movie list
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=4128cfc2b46ab8280e97803056929f88&language=en-US&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        },
      },
    )
      .then(res => res.json())
      .then(value => {
        value.results.length === 0 ? setResponseEmpty(true) : null,
          page === 1
            ? setTrendingMovies(value.results)
            : setTrendingMovies([...trendingMovies, ...value.results]),
          setLoading(false);
        setListLoading(false);
        console.log('LENGHT', value.results.length);
      })
      .catch(e => {
        console.log(e);
      });
    setRefreshing(false);
  };

  React.useEffect(() => {
    //when chnage in dbvalue call searchMovieName
    console.log('FIRE');
    if (dbValue !== '') {
      SearchMovieName(dbValue, 1);
    }
  }, [dbValue]);

  React.useEffect(() => {
    getTrendingMovieList(1);
  }, []);

  const searchFilterFunction = text => {
    setLoading(true); //seacrbar loader
    setValue(text);
    debouncedSave(text);
  };

  const handleEnd = async () => {
    console.log('triggered');
    getTrendingMovieList(trendingMoviePage + 1);
    setTrendingMoviesPage(trendingMoviePage + 1);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 20}}>
      <Text style={{...Styles.title}}>Movies</Text>
      <SearchBar
        showLoading
        loadingProps={{
          animating: loading,
          color: 'black',
        }}
        containerStyle={{
          ...Styles.serchBarContainer,
        }}
        inputContainerStyle={{
          backgroundColor: 'rgba(239, 239, 240, 1)',
          borderRadius: 10,
        }}
        inputStyle={{color: '#939599'}}
        placeholder="Search Here..."
        lightTheme
        round
        searchIcon={{size: 24}}
        onChangeText={text => searchFilterFunction(text)}
        onClear={() => {
          setLoading(false);
          console.log('CLEW');
          setValue('');
          saveToDb('');
        }}
        value={value}
      />

      {/* MOVIE LIST */}

      <FlatList
        data={trendingMovies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (dbValue === '') {
            setListLoading(true);
            responseEmpty ? '' : handleEnd();
          }
        }}
        ListFooterComponent={() => {
          return (
            <View style={{height: 40, justifyContent: 'center'}}>
              {listLoading === false ? null : (
                <ActivityIndicator size="small" color={'black'} animating />
              )}
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={refreshing}
            color={'black'}
            onRefresh={() => {
              if (dbValue !== '') {
                SearchMovieName(dbValue, 1);
              } else getTrendingMovieList(1);
            }}
          />
        }
      />
    </View>
  );
};

export default SearchScreen;

const Styles = StyleSheet.create({
  title: {
    paddingTop: 18,
    color: '#1E2228',
    fontSize: 24,
    fontWeight: 'bold',
  },
  serchBarContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 0,
    paddingBottom: 20,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginTop: 10,
  },
});
