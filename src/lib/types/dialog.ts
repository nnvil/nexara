export type DialogSuccessState = {
    title: string;
    message: string;
    buttons: DialogButton[];
};

export type DialogButton = {
    text: string;
    type?: "submit" | "secondary";
    primary?: boolean;
    timeout?: number; // milliseconds
    action?: () => unknown | Promise<unknown>;
    onClick?: (
        values?: Record<string, string>
    ) => Promise<DialogSuccessState | void> | void;
};

export type DialogInput = {
    id: string;
    label: string;
    type?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
};

type Dialog = {
    id: string;
    dismissable?: boolean;
};

type BaseDialog = Dialog & {
    type: "base";
    title?: string;
    description?: string;
    buttons?: DialogButton[];
};

type InputDialog = Dialog & {
    type: "input";
    title?: string;
    description?: string;
    buttons?: DialogButton[];
    inputs: DialogInput[];
};

export type DialogInfo = BaseDialog | InputDialog;
