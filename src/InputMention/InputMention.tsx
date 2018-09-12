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
    showOptions: boolean;
}

export class InputMention extends React.Component<InputMentionProps, InputMentionState> {
    public constructor(props: InputMentionProps, state: InputMentionState) {
        super(props, state);

        this.state = {
            optionPosition: {
                left: 100,
                top: 100
            },
            showOptions: true
        };
    }

    public render() {
        return (
            <div style={{position: "relative"}}>
                <textarea />
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
}
