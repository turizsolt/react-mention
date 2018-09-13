import {style} from 'typestyle';

export const styles = {
    optionImage: style({
        borderRadius: "0.5em",
        height: "1em",
        marginLeft: "0.2em",
        marginRight: "0.2em",
        width:"1em",
    }),
    optionItem: style({
        paddingRight: "0.2em",
    }),
    optionMentionTag: style({
        fontSize: "80%",
        fontStyle: "italic", 
    }),
    optionsBox: style({
        border: "1px solid gray",
        boxShadow: "2px 2px 5px 1px rgba(0,0,0,0.75)",
        position: "absolute",
    }),
    outerDiv: style({
        position: "relative"
    }),
    searchBar: style({
        backgroundColor: "white"
    }),
    searchTerm: style({
        backgroundColor: "#dedede"
    }),
};
