import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
class Search extends React.Component {

  _displayDetailForFilm = (idFilm) => {
    console.log("Display film with id " + idFilm)
  }

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     films: [],
  //     searchedText: "",
  //     isLoading: false
  //   }
  // }

  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0 // Compteur pour connaître la page courante
    this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
    this.state = {
      films: [],
      isLoading: false
    }
}

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
          {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
        </View>
      )
    }
  }

  _searchTextInputChanged(text) {
          this.setState({ searchedText: text })
  }

  _loadFilms() {
    console.log(this.state.searchedText) // Un log pour vérifier qu'on a bien le texte du TextInput
    if (this.state.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.state.searchedText).then(data => {
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({ 
            // films: data.results,
            films: [ ...this.state.films, ...data.results ],

            isLoading: false
           })
      })
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <TextInput 
          style={styles.textinput}
          placeholder='Titre du film'
          onChangeText={(text) => this._searchTextInputChanged(text)}
          onSubmitEditing={() => this._loadFilms()}
        />
        <Button title='Rechercher' onPress={() => this._loadFilms()}/>
        <FlatList
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
               this._loadFilms()
            }
        }}
          />
          {this.state.isLoading ?
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' />
            </View>
            : null
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 20
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Search