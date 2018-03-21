import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Chip from '../Chip/Chip';

export default class Chips extends Component {


    constructor(props) {
    super(props);
        this.state = {
            error: null
        };
        this.styles = styles;
    }


    static defaultProps = {
        onChipClose: () => {},
    }


    chipClose(chip){
        console.log(chip)
    }

    onChipClose = onClose => {
        const { onChipClose } = this.props;
        const { error } = this.state;
    }
    renderChip(data) {
        return (
          <Chip key={`${data}-${new Date()}`}
                iconStyle={this.styles.chipIcon}
                onClose={() => this.onChipClose(this.chipClose(data))}
                text={data}
                style={this.styles.chip}
            />
        );
      }
    

    render() {
        const { items } = this.props;
        return ( 
        <ScrollView 
         horizontal={true}>
            {items.map(this.renderChip, this)}
        </ScrollView>
    );
    }
}
//style={styles.listWrapper}
const styles = StyleSheet.create({
    chip: {
        paddingRight: 2
    },
    chipIcon: {
        height: 24,
        width: 24
    },
    list: {
        backgroundColor: '#fff'
    },
    listRow: {
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    listWrapper: {
        flex :1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
});


