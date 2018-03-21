import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Chip from '..//Chip/Chip';

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

    onChipClose = onClose => {
        const { onChipClose } = this.props;
        const { error } = this.state;

    //    onChipClose(!error && this.getSelectedEmails().length > 1);
        onClose();
    }
    renderChip(data) {
        return (
          <Chip
          key={data.label}
          iconStyle={this.styles.chipIcon}
          onClose={() => this.onChipClose(onClose)}
          text={data.label}
          style={this.styles.chip}
        />
        );
      }
    

    render() {
        const { items } = this.props;
        return ( 
        <TouchableOpacity>
        <View style={styles.listWrapper}>
            {items.map(this.renderChip, this)}
        </View>
        </TouchableOpacity>
    );
    }
}
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


