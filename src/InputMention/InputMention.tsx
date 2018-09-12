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
    currentOptionIndex: number;
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
            currentOptionIndex: 0,
            optionPosition: {
                left: 100,
                top: 100
            },
            searchText: "",
            showOptions: false,
            startsFrom: 0,
            text: "",
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.filterCondition = this.filterCondition.bind(this);
        this.filterConditionText = this.filterConditionText.bind(this);
    }

    public render() {
        return (
            <div style={{position: "relative"}}>
                <textarea 
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                    onChange={this.onTextChange}
                    value={this.state.text}
                />
                <div style={{
                    border: "1px solid red",
                    display: this.state.showOptions ? "block" : "none",
                    left: this.state.optionPosition.left + "px",
                    position: "absolute",
                    top: this.state.optionPosition.top + "px",
                    width: "200px",
                }}>
                    {
                        this.props.list
                            .map((item, key) => (
                                <div key={key} style={{display: (this.filterCondition(item) ? "block" : "none") , backgroundColor: (key===this.state.currentOptionIndex?"blue":"inherit")}}>
                                <img src={item.imageUrl} style={{
                                    borderRadius: "0.5em",
                                    height: "1em",
                                    width:"1em",
                                }} />
                                {item.text}
                                </div>
                            )
                        )
                    }
                </div>
        </div>
        );
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
        this.setState((state) => ({ currentOptionIndex: this.next(state.currentOptionIndex) }));
        event.preventDefault();
    }

    private handleUp(event: any) {
        this.setState((state) => ({ currentOptionIndex: this.prev(state.currentOptionIndex) }));
        event.preventDefault();
    }

    private handleEscape(event: any) {
         this.setState({ showOptions: false });
        event.preventDefault();
    }

    private handleEnter(event: any) {
        this.setState({ 
            showOptions: false,
            text: this.insertMentionToText(event)
        });
        event.preventDefault();
    }

    private insertMentionToText(event: any) {
        return this.state.text.substring(0, this.state.startsFrom) +
            this.getInsertableMention(event) +
            this.state.text.substr(event.target.selectionEnd) +
            " ";
    }

    private getInsertableMention(event: any) {
        return this.isFilteredListHasElements() ?
            this.props.list[this.state.currentOptionIndex].mentionTag :
            this.state.text.substring(this.state.startsFrom, event.target.selectionEnd);
    }

    private isFilteredListHasElements() {
        return this.props.list.filter(this.filterCondition).length > 0;
    }

    /************/

    private filterCondition(item: InputMentionListItem): boolean {
        return this.filterConditionText(item, this.state.searchText);
    }

    private filterConditionText(item: InputMentionListItem, searchText: string): boolean {
        return item.text.toLocaleLowerCase().indexOf(searchText) !== -1;
    }

    private next(index: number): number {
        if(this.props.list.filter(this.filterCondition).length === 0) { return 0; }

        do {
            index++;
            if(index >= this.props.list.length) { index = 0;}
        }
        while (!this.filterCondition(this.props.list[index]));

        return index;
    }

    private nextText(index: number, searchText: string): number {
        if(this.props.list.filter(item => this.filterConditionText(item, searchText)).length === 0) { return 0; }

        do {
            index++;
            if(index >= this.props.list.length) { index = 0;}
        }
        while (!this.filterConditionText(this.props.list[index], searchText));

        return index;
    }

    private prev(index: number): number {
        if(this.props.list.filter(this.filterCondition).length === 0) { return 0; }

        do {
            index--;
            if(index < 0) { index = this.props.list.length-1;}
        }
        while (!this.filterCondition(this.props.list[index]));

        return index;
    }

    private onKeyUp(event: any) {
        const charAtSelection = this.state.text.substr(event.target.selectionStart-1,1);
        const charBeforeSelection = event.target.selectionStart < 2 ? " " : this.state.text.substr(event.target.selectionStart-2,1) ;
        let showOptions = this.state.showOptions;
        
        if(charAtSelection === "@" && charBeforeSelection === " ") {
            this.setState({
                showOptions: true,
                startsFrom: event.target.selectionStart
            });
            showOptions = true;
        }

        let searchText = this.state.searchText;
        if(showOptions) {
            this.setState({
                searchText: this.state.text.substring(this.state.startsFrom, event.target.selectionEnd+1)
            });
            searchText = this.state.text.substring(this.state.startsFrom, event.target.selectionEnd+1);
        
            if(this.state.startsFrom > event.target.selectionStart) {
                this.setState({
                    showOptions: false
                });
                showOptions = false;
            }
        }

        if(showOptions && !this.filterConditionText(this.props.list[this.state.currentOptionIndex], searchText)) {
            
            this.setState((state) => {
                return {
                    currentOptionIndex: this.nextText(-1, searchText)
                };
            });
        }
    }

    
}
