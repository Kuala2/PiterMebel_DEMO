export interface ClientReview {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  lines: string[];
  sourceUrl: string;
}

export const YANDEX_REVIEWS_URL =
  "https://yandex.ru/maps/org/pitermebel/245406542043/reviews/";

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "konstantin-aleksandrovich",
    author: "Константин Александрович",
    rating: 5,
    lines: [
      "Широчайший выбор различных мебельных изделий на любой вкус и цвет, всё качественное и из экологически чистых материалов. Персонал добрый(не злой)). Ура товарищи!!!",
    ],
    sourceUrl: YANDEX_REVIEWS_URL,
  },
  {
    id: "marina-krasnova",
    author: "марина краснова",
    rating: 5,
    lines: [
      "Выражаю огромную благодарность Елене за профессионализм и приятное общение, команда исполнила заказ во всю квартиру четко в срок, на каждом этапе поддержка и помощь! Ольга, спасибо за помощь в понимании технологии, Сергею - за сборку! Наилучшие рекомендации и удачи вашему производству ❤️",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=xx9a5e7bmfm58p93tr09f7uft0",
  },
  {
    id: "ivan-supronov",
    author: "Иван Супронов",
    rating: 5,
    lines: [
      "Большое спасибо за классную кухню. Хорошее отношение с первых минут. Отличный дизайн и исполнение в сроки. Отдельное благодарю установщика Сергея за скурпулезный подход к монтажу. Всех благ и процветания команде профессионалов ПитерМебель. Всем рекомендую.",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=49qzx35vjrc7fc81b6nq5rkbr4",
  },
  {
    id: "olga-shevchenko",
    author: "Ольга Шевченко",
    rating: 5,
    lines: [
      "Семья Волковых - это команда мастеров своего дела. Лена и Дима настроили свое производство таким образом, что к ним хочется возвращаться. К клиенту относятся как к себе и делают мебель на совесть. Рекомендую.",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=8znemxc4vaz37k7ct4cmcjea8g",
  },
  {
    id: "irina-artemeva",
    author: "Ирина Артемьева",
    rating: 5,
    lines: [
      "Огромное спасибо вам, прихожая идеальная. Сделано очень быстро и качественно. Цвет шикарный. Буду рекомендовать вас.",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=0vv1p9m0kbeuk458y5hezfqp80",
  },
  {
    id: "yanka-burtanka",
    author: "Янка Буртанька",
    rating: 5,
    lines: [
      "Заказывали шкаф купе",
      "Очень довольна работой этой компании.",
      "Качественно, быстро и цена не космическая",
      "Учли все мои пожелания)))",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=6zwu69103x2akmtfbthxrzdqp0",
  },
  {
    id: "vorkuta-ak111",
    author: "Воркута АК111",
    rating: 5,
    lines: [
      "Хорошая организация, все сделали супер. Сборщик Сергей человек с руками! Спасибо большое!!!",
    ],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=ppck04ywejarcng3e6qyuwf4cm",
  },
  {
    id: "aleksey-efimov",
    author: "алексей ефимов",
    rating: 5,
    lines: ["Все очень понравилось. Сделали быстро и качественно."],
    sourceUrl:
      "https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=fm93xvxhk3qhw79pz91tmv0wn0",
  },
];
