import { SpotResponse } from "@/generated/model";
import * as THREE from "three";

export type RoomInfo = SpotResponse & {
  position: THREE.Vector3;
};

const roomInfos: RoomInfo[] = [
  {
    description:
      "アユタヤ遺跡は、タイ王国中部にあるアユタヤの遺跡群です。アユタヤはかつてタイ内陸の交易の中心として栄えたアユタヤ王朝の都で、400年にわたって繁栄しました。アユタヤ王朝時代に築かれた寺院跡や宮殿跡などが残っており、歴史公園として整備されています。1991年にユネスコ世界遺産に登録されました。",
    id: "ayutthaya1",
    name: "アユタヤ",
    sphericalImageUrl: "/images/ayutthaya1-3d.png",
    sphericalVideoUrl: "/videos/ayutthaya/ayutthaya1.m3u8",
    thumbnailImageUrl: "/images/ayutthaya1-2d.png",
    position: new THREE.Vector3(500, 0, 0),
  },
  {
    description:
      "もともとは工業地帯だった豊洲。 1990年代以降、商業施設やオフィスビル、タワーマンションなどが多数建設され、働く・住む・楽しむを叶えるスポットとして人気を集めるようになりました。 「豊かな地になるように」と願ってつけられた「豊洲」という名の通り、現在も発展を続けています。",
    id: "toyosu_city1",
    name: "豊洲市街",
    sphericalImageUrl: "/images/toyosu1-3d.png",
    sphericalVideoUrl: "/videos/toyosu1/toyosu1.m3u8",
    thumbnailImageUrl: "/images/toyosu1-2d.png",
    position: new THREE.Vector3(0, 0, -500),
  },
  {
    description:
      "豊洲ベイサイドクロスタワーのウェブサイトです。豊洲ベイサイドクロスタワーは、東京都江東区豊洲二丁目２番１号にあるオフィス、商業施設、ホテルなどが集まる、大型複合施設です。",
    id: "toyosu_city2",
    name: "豊洲BSX地下施設",
    sphericalImageUrl: "/images/toyosu2-3d.png",
    sphericalVideoUrl: "/videos/toyosu2/toyosu2.m3u8",
    thumbnailImageUrl: "/images/toyosu2-2d.png",
    position: new THREE.Vector3(-500, 0, 0),
  },
];

export const getRoomInfoById = (roomId: string): RoomInfo | undefined => {
  const find = roomInfos.find((room) => room.id === roomId);
  return find;
};
