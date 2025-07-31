<?php

namespace App\Console\Commands;

use Prism\Prism\Prism;
use Illuminate\Console\Command;
use Prism\Prism\Enums\Provider;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;

class TestAI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:ai';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Prism::text()
            ->using(Provider::Gemini, 'gemini-2.0-flash')
            ->withMessages([
                new UserMessage('0 ta commit, 0 ta LeetCode, 0 daqiqa kod, 1700 qadam.'),
                new AssistantMessage("Ha bo‘ldi, bugun seni koding uyquga ketgan shekilli 😴. LeetCode ham jim, VS Code ham ochilmagan. Qadam yurish bo‘yicha esa… 1700? Bu kvartiradan magazingacha borib kelganmi? 🤨\n\nErtaga o‘zingga kel, baribir hech kim o‘rniga sen uchun commit qilmaydi. ‘Kod yozmasang, kod o‘chadi’ — degan gap bor-ku 😉"),

                new UserMessage('2 commit, 1 LeetCode, 40 daqiqa kod, 2800 qadam.'),
                new AssistantMessage("Bugun harakat bor, lekin temp past. 2 commit — yaxshi, lekin kod yozganing 40 daqiqa bo‘lsa, qolgan vaqtingda nima qilding, VS Code fonida serial ko‘rdingmi? 🤨\n\nErtaga kamida 1.5x ko‘proq qil, yo‘qsa loyihang GitHub’dan chang bosadi. Yodingda bo‘lsin: ‘Ro‘yxatdan o‘tgan emas, davom etgan yutadi!’ 🔥"),

                new UserMessage('5 ta LeetCode, 3 soat kod, 4200 qadam, 1 ta PR.'),
                new AssistantMessage("Bugun sen boshqa odamsanmi, yo tongda kofe o‘rniga motivatsiya ichdingmi? 💪 LeetCode 5ta, PR ham ochilgan. Lekin yurish bo‘yicha hali ham sustsan — 4200 qadam? ‘Kodchi, lekin yurmaydi’ degan mashhur developer maqoli esingdami? 😂\n\nErtaga shu ritmni saqla, lekin tana ham harakat istaydi. Yaxshi dev — bu kodlaydi ham, sog‘lom ham bo‘ladi!"),

                new UserMessage('7 commit, 4 LeetCode, 2.5 soat kod, 8000 qadam.'),
                new AssistantMessage("Sen bugun rasmiy ‘king of grind’ bo‘lding 👑! 7 commit? GitHub o‘ziyam hayron qolyapti. 4 ta masala, 8000 qadam — seni to‘xtatadigan kuch yo‘qdek.\n\nErtaga ham shunaqa ‘gazni bos’. Biror joyda boshlab, keyin to‘xtab qolganlar emas, oxirigacha yetkazganlar tarixda qoladi. Loyihangdan chiqib ketish haqida o‘ylasang, esla: ‘Er yigit yo boshlamasin, yo bitirsin!’ 🔥"),

                new UserMessage('1 commit, 0 LeetCode, 25 daqiqa kod, 1500 qadam.'),
                new AssistantMessage("Hafta oxiri charchoq bosganini tushunaman, lekin bu darajada emas edi-ku 😐. 25 daqiqa kod bu ‘VS Code ochdim, terminalga bitta ls yozdim’ degan bilan barobar. Qadam? 1500 — bu oshxonadan zaxiraga borib kelgan bo‘lsang kerak 😅\n\nBugun dam bo‘lsa ham, ertaga yana yo‘lga tush. ‘Bugun qiynalmasang, ertaga pushaymon bo‘lasan’ deganlarida, aynan shunday kunlar nazarda tutilgan."),
                new UserMessage(<<<'TEXT'
                    Bugungi eng yaxshi 10 foydalanuvchi statistikasi:

                    1. @furqat - 1 commit, 2 LeetCode, 2.5 soat kod, 200 qadam
                    2. @dilshod - 5 commit, 4 LeetCode, 2 soat kod, 7900 qadam
                    3. @nodira - 3 commit, 5 LeetCode, 1.5 soat kod, 9100 qadam
                    4. @javohir - 6 commit, 2 LeetCode, 3 soat kod, 3500 qadam
                    5. @aziza - 2 commit, 1 LeetCode, 1 soat kod, 6000 qadam
                    6. @anvar - 4 commit, 2 LeetCode, 2 soat kod, 4500 qadam
                    7. @bobur - 1 commit, 0 LeetCode, 40 daqiqa kod, 7200 qadam
                    8. @madina - 0 commit, 3 LeetCode, 1.2 soat kod, 8200 qadam
                    9. @umar - 2 commit, 0 LeetCode, 30 daqiqa kod, 6800 qadam
                    10. @shahnoza - 1 commit, 1 LeetCode, 50 daqiqa kod, 5400 qadam

                    Shu ma'lumotlarga asoslanib:
                    - Bugungi kun bo‘yicha umumiy xulosa yoz
                    - Eng kuchli foydalanuvchini alohida e’tirof et
                    - Kim kuchli harakatda, kim sust — buni kulgili tilda aytib o‘t
                    - Barchaga ertangi kun uchun motivatsiya ber
                    - O‘zbekona “ko‘cha tili”dan foydalan — qiziq bo‘lsin, lekin loyihadan chiqib ketmaydigan darajada 😉
                    TEXT),
            ])
            ->asText();

        $this->info($response->text);
    }
}
