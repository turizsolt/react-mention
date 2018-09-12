import * as React from 'react';

export interface InputMentionListItem {
    mentionTag: string;
    text: string;
    imageUrl?: string;
}

export interface InputMentionProps {
    list: InputMentionListItem[];
}

export interface InputMentionState {
    optionPosition: {
        left: number,
        top: number
    };
    searchText: string;
    showOptions: boolean;
    startsFrom: number;
    text: string;
}

export class InputMention extends React.Component<InputMentionProps, InputMentionState> {
    public constructor(props: InputMentionProps, state: InputMentionState) {
        super(props, state);

        this.state = {
            optionPosition: {
                left: 100,
                top: 100
            },
            searchText: "",
            showOptions: false, // true,
            startsFrom: 0,
            text: ""
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    public render() {
        return (
            <div style={{position: "relative"}}>
                <textarea 
                    onKeyUp={this.onKeyDown}
                    onChange={this.onTextChange}
                    value={this.state.text}
                />
                <div style={{
                    display: this.state.showOptions ? "block" : "none",
                    left: this.state.optionPosition.left + "px",
                    position: "absolute",
                    top: this.state.optionPosition.top + "px",
                    width: "200px",
                }}>
                    {
                        this.props.list.map((item, key) => (
                            <div key={key}>{item.text}</div>
                        ))
                    }
                </div>
        </div>
        );
    }

    private onKeyDown(event: any) {
        const myChar = this.state.text.substr(event.target.selectionStart-1,1);
        let showOptions = this.state.showOptions;
        
        if(myChar === "@") {
            console.log("at", event.target.selectionStart-1);
            this.setState({
                showOptions: true,
                startsFrom: event.target.selectionStart
            });
            showOptions = true;
        }

        if(showOptions) {
            this.setState({
                searchText: this.state.text.substring(this.state.startsFrom, event.target.selectionEnd+1)
            });
        }
        console.log("search", this.state.text.substring(this.state.startsFrom, event.target.selectionEnd+1));

        if(event.which === 13) {
            console.log("enter");
        }

        if(event.which === 27) {
            console.log("esc");

            this.setState({
                showOptions: false
            });
        }

        if(event.which === 38) {
            console.log("up");
        }

        if(event.which === 40) {
            console.log("down");
        }

        console.log("keyDown", event, event.target.selectionStart, event.target.selectionEnd, myChar, event.which, this.state.text);
    }

    private onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: event.target.value
        });
    }
}
