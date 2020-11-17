import React, { Component } from 'react';
import { Container, Content, List, Thumbnail, Text, Body, View} from 'native-base';
import {Linking, ScrollView, StyleSheet,Alert,RefreshControl} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Placeholder,PlaceholderMedia,PlaceholderLine,Loader} from "rn-placeholder";
import { Card } from '../components/Card';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale

export default class ListThumbnailExample extends Component {
  
  constructor(props) {
    super(props);
 
    this.state = {
      dataIsReturned:false,
      package: [],
      refreshing: false,
    };
  }
 
fetchData() {
    fetch('http://192.168.1.19:5000/muh_fak')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ package: responseJson,dataIsReturned:true});
      }).catch(error => {
         console.log(error);
         //alert("Head","Details",[{text:"button text",onpress:"button function"}])
         Alert.alert("Hata","Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.",[{
           text:"Tamam",
           onPress: () =>this.fetchData()
           
         }]);
      });
  }
  UNSAFE_componentWillMount() {
    this.fetchData();
  }
  
  renderItems() {
    return this.state.package.map((item,i) => {
      if(i==0){
        return (
        <ListItem key={i-1}
          transparent onPress={ ()=>{ Linking.openURL(item.url)}}
          Component={TouchableScale}
          friction={90} 
          tension={100} 
          activeScale={0.95}
          >
            <Text style={styles.headline}>{"\nGÜNCEL DUYURU:\n"}</Text>
              <Body>
                    <Text style={styles.textline}>{item.head}</Text>
              </Body>
        </ListItem>
       
    );}
    else{
      return(<ListItem thumbnail key={i} >
        <Thumbnail square source={{ uri: 'https://www.erciyes.edu.tr/Dosyalar/eru-logo/ars-unv-logo-TR.png' }} />
      <Body>
        <TouchableScale transparent onPress={ ()=>{ Linking.openURL(item.url)}} 
          Component={TouchableScale}
          friction={90} 
          tension={100} 
          activeScale={0.95}>
        
          <Text>{item.head+"\n"}</Text>
          <Text note numberOfLines={2}>{item.details}{"\n"}</Text>
          <Text></Text>
          <View  style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontSize:12,color: 'gray'}}>{item.date}</Text>
          <Text style={{ fontSize:12,color: '#143f90'}}>Devamı için tıklayın</Text>
          </View>
          
        </TouchableScale>
      </Body>
    </ListItem>);
    }
    });
}

onRefresh = () => {
  this.setState({ refreshing: true });
  // In actual case set refreshing to false when whatever is being refreshed is done!
  setTimeout(() => {
    this.setState({ refreshing: false });
    this.fetchData();
  }, 2000);
};
  render() {
    var loadingElements = [];

	for(let i = 0; i < 20; i++){
		loadingElements.push(
				<Card key = {i}>
            <Placeholder
              Left={PlaceholderMedia}
              Animation={Loader}>
              <PlaceholderLine width={80} />
              <PlaceholderLine />
              <PlaceholderLine width={30} />
            </Placeholder>
          </Card>
		)
  }
    if(this.state.dataIsReturned== true){
      return (
        <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            title="Pull to refresh"
          />
        }>
          <List >
          {
          this.renderItems()
          }
          </List>
        </Content>
      </Container>
        );
      }
      else{
        
        return(
          
          <Container>
            <Content>
              <ScrollView>
              {
                loadingElements
               
              }
              </ScrollView>
            </Content>
          </Container>
        
        );
      }
  }
}
const styles = StyleSheet.create({
  
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 0,
    width: 200,
    color:'#143f90'
  },
  textline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 0,
    width: 200,
    color:'black'
  },
  continueText: {
    alignSelf: 'flex-end',
    fontSize:12,
    color: '#143f90'
  },
  
});
