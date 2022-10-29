export default class WebsocketClientUtils {
  public static constructMessage(type: string, data: any) {
    return JSON.stringify({
      type,
      data,
    });
  }
}
