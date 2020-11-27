import {loadSync, Message} from "protobufjs";

export class LocationInfo extends Message<LocationInfo> {
    version: number;
    name: string;
    location: string;
    room: string;
    venueType: number;
    notificationKey: Uint8Array;
}

export class QRCodeContent extends Message<QRCodeContent> {
    version: number;
    publicKey: Uint8Array;
    pEnt: Uint8Array;
    info: LocationInfo;
}

export class QRCodeTrace extends Message<QRCodeTrace> {
    version: number;
    trSk: Uint8Array;
    trR2: Uint8Array;
    pTrR1: Uint8Array;
    pTrR2: Uint8Array;
    info: LocationInfo;
}

const protoRoot = loadSync("v1_1/messages.proto");
protoRoot.lookupType("crowdnotifier_v1_1.QRCodeContent").ctor = QRCodeContent;
protoRoot.lookupType("crowdnotifier_v1_1.QRCodeTrace").ctor = QRCodeTrace;
protoRoot.lookupType("crowdnotifier_v1_1.LocationInfo").ctor = LocationInfo;
