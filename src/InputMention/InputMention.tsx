import * as React from 'react';
import * as getCaretCoordinates from 'textarea-caret';

export interface InputMentionListItem {
    mentionTag: string;
    text: string;
    imageUrl?: string;
}

export interface InputMentionProps {
    list: InputMentionListItem[];
    showSearchBar?: boolean;
}

export interface InputMentionState {
    currentOptionIndex: number;
    optionPosition: {
        left: number,
        top: number
    };
    savedSelectionEnd: number,
    searchText: string;
    showOptions: boolean;
    startsFrom: number;
    text: string;
}

export class InputMention extends React.Component<InputMentionProps, InputMentionState> {
    private refTextArea = React.createRef<HTMLTextAreaElement>();

    public constructor(props: InputMentionProps, state: InputMentionState) {
        super(props, state);
        this.state = this.getInitState();
        this.setThisBindings();
    }

    public render() {
        return (
            <div style={{position: "relative"}}>
                <textarea 
                    ref={this.refTextArea}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                    onChange={this.onTextChange}
                    onClick={this.onTextClick}
                    value={this.state.text}
                />
                <div style={{
                    border: "1px solid gray",
                    boxShadow: "box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.75)",
                    display: this.state.showOptions ? "block" : "none",
                    left: this.state.optionPosition.left + "px",
                    position: "absolute",
                    top: this.state.optionPosition.top + "px",
                    width: "300px",
                }}>
                    { this.props.showSearchBar &&
                        <div style={{backgroundColor: "white"}}>Search: <span style={{backgroundColor: "#dedede"}}>{this.state.searchText}</span></div>
                    }
                    {
                        this.props.list
                            .map((item, key) => (
                                <div key={key} 
                                    className="item"
                                    style={{
                                        backgroundColor: (key===this.state.currentOptionIndex?"#dedede":"white"),
                                        display: (this.filterCondition(item) ? "block" : "none"),
                                        paddingRight: "0.2em"
                                    }}
                                    onClick={this.onItemClick(key)}
                                >
                                <img src={item.imageUrl} style={{
                                    borderRadius: "0.5em",
                                    height: "1em",
                                    marginLeft: "0.2em",
                                    marginRight: "0.2em",
                                    width:"1em",
                                }} />
                                {item.text}
                                <span style={{fontStyle: "italic", fontSize: "80%"}}>(@{item.mentionTag})</span>
                                </div>
                            )
                        )
                    }
                </div>
        </div>
        );
    }

    private getInitState(): Readonly<InputMentionState> {
        return {
            currentOptionIndex: 0,
            optionPosition: {
                left: 100,
                top: 100
            },
            savedSelectionEnd: 0,
            searchText: "",
            showOptions: false,
            startsFrom: 0,
            text: "",
        };
    }

    private setThisBindings(): void {
        this.onTextChange = this.onTextChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.filterCondition = this.filterCondition.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onTextClick = this.onTextClick.bind(this);
    }

    private onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: event.target.value
        });
    }

    private onKeyDown(event: any) {
        if (!this.state.showOptions) { return; }
        
        if (this.isEnter(event)) {
            this.handleEnter(event);
        } else if (this.isEscape(event)) {
            this.handleEscape(event);
        } else if (this.isUp(event)) {
            this.handleUp(event);
        } else if (this.isDown(event)) {
            this.handleDown(event);
        }
    }

    private onKeyUp(event: any) {
        let stateChanges:any = {};

        if (this.state.showOptions) {
            if(this.state.startsFrom > event.target.selectionStart) {
                stateChanges.showOptions = false;
                stateChanges.searchText = "";
            } else {
                stateChanges.searchText = this.state.text.substring(this.state.startsFrom, event.target.selectionEnd);
            }
        } else if(this.isTriggeredByAt(event)) {
            const coords = getCaretCoordinates(event.target, event.target.selectionEnd, {});

            stateChanges = {
                ...stateChanges,
                optionPosition: {
                    left: coords.left,
                    top: coords.top+20
                },
                showOptions: true,
                startsFrom: event.target.selectionStart
            };
        }
        stateChanges.savedSelectionEnd = event.target.selectionEnd;

        this.setState(stateChanges, () => {
            if (this.state.showOptions && !this.filterCondition(this.props.list[this.state.currentOptionIndex])) {
                this.setState({ currentOptionIndex: this.getNextItemIndex(-1) });
            }
        });
    }

    private onTextClick(event: any) {
        this.onKeyUp(event);
    }

    private onItemClick(index: number) {
        return ((event:any) => {
            this.setState({ 
                showOptions: false,
                text: this.insertMentionToText({target: {selectionEnd: this.state.savedSelectionEnd}}, index)
            });
            if(this.refTextArea.current) {
                this.refTextArea.current.focus();
            }
        });
    }

    private isDown(event: any) {
        return event.which === 40;
    }

    private isUp(event: any) {
        return event.which === 38;
    }

    private isEscape(event: any) {
        return event.which === 27;
    }

    private isEnter(event: any) {
        return event.which === 13;
    }

    private handleDown(event: any) {
        this.setState((state) => ({ currentOptionIndex: this.getNextItemIndex(state.currentOptionIndex) }));
        event.preventDefault();
    }

    private handleUp(event: any) {
        this.setState((state) => ({ currentOptionIndex: this.getPrevItemIndex(state.currentOptionIndex) }));
        event.preventDefault();
    }

    private handleEscape(event: any) {
         this.setState({ showOptions: false, searchText: "" });
        event.preventDefault();
    }

    private handleEnter(event: any) {
        const textarea = event.target;
        const insertLength = this.getInsertableMention(event, this.state.currentOptionIndex).length;
        this.setState({ 
            searchText: "",
            showOptions: false,
            text: this.insertMentionToText(event, this.state.currentOptionIndex)
        }, () => {
            textarea.selectionStart = this.state.startsFrom + insertLength + 1;
            textarea.selectionEnd = textarea.selectionStart;
        });
        event.preventDefault();
    }

    private insertMentionToText(event: any, index: number) {
        return this.state.text.substring(0, this.state.startsFrom) +
            this.getInsertableMention(event, index) + 
            " " +
            this.state.text.substr(event.target.selectionEnd);
    }

    private getInsertableMention(event: any, index: number) {
        return this.isFilteredListHasElements() ?
            this.props.list[index].mentionTag :
            this.state.text.substring(this.state.startsFrom, event.target.selectionEnd);
    }

    private isFilteredListHasElements() {
        return this.props.list.filter(this.filterCondition).length > 0;
    }

    private filterCondition(item: InputMentionListItem): boolean {
        return item.text.toLocaleLowerCase().indexOf(this.state.searchText.toLocaleLowerCase()) !== -1
            || item.mentionTag.toLocaleLowerCase().indexOf(this.state.searchText.toLocaleLowerCase()) !== -1;
    }

    private getPrevItemIndex(index: number): number {
        if(!this.isFilteredListHasElements()) { return 0; }

        do {
            index--;
            if(index < 0) { index = this.props.list.length-1;}
        }
        while (!this.filterCondition(this.props.list[index]));

        return index;
    }

    private getNextItemIndex(index: number): number {
        if(!this.isFilteredListHasElements()) { return 0; }

        do {
            index++;
            if(index >= this.props.list.length) { index = 0;}
        }
        while (!this.filterCondition(this.props.list[index]));

        return index;
    }

    private isTriggeredByAt(event: any) {
        const charAtSelection = this.state.text.substr(event.target.selectionStart - 1, 1);
        const charBeforeSelection = event.target.selectionStart < 2 ? " " : this.state.text.substr(event.target.selectionStart - 2, 1);
        return charAtSelection === "@" && charBeforeSelection === " ";
    }
}
