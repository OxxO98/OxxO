export {};

declare global {
  
  //context
  interface MediaQueryContextInterface {
    pc : string;
    tablet : string;
    mobile : string;
  }

  interface UnicodeContextInterface {
    kanji : RegExp;
    kanjiStart : RegExp;
    hiragana : RegExp;
    okuri : RegExp;
  }

  interface UnicodeRangeContextInterface {
    kanji : string;
    hiragana : string;
    katakana : string;
  }

  interface UserContextInterface {
    userId : number | null;
    setUserId : (userId : numbe | null) => void;
  }

  interface ObjStringKey<T> extends Array<T> {
    [index : string | number] : T;
  }

  type ObjKey = {
    [index : string | number] : any;
  }

  //type


  //Interface

  interface StyledObj {
    bId : number;
    startOffset : number;
    endOffset : number;
    opt : string;
  }

  interface RefetchObj {
    fetchBun : () => void;
    fetchHukumu : () => void;
    fetchTL : () => void;
  }
  
  interface OffsetObj {
    startOffset : number;
    endOffset : number;
  }

  interface HukumuDataObj {
    huId : number;
    tId : number;
    hyId : number;
    yId : number;
    hyouki : string;
    yomi : string;
    startOffset : number;
    endOffset : number;
  }

  interface AddPointObj {
    type : "DAN" | "BUN" | null;
    dId : number | null;
    bId : number | null;
    prev : boolean;
  }

  ///youtube
  interface AutoStopObj {
    set : boolean;
    startOffset : number;
    endOffset : number;
    loop : boolean;
  }
}
