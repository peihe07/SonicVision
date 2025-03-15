from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Playlist, Watchlist

User = get_user_model()

class Command(BaseCommand):
    help = '創建主題推薦清單'

    def handle(self, *args, **kwargs):
        # 確保有一個系統管理員帳號
        admin_user, created = User.objects.get_or_create(
            username='system_admin',
            defaults={
                'is_staff': True,
                'is_superuser': True,
                'email': 'admin@sonicvision.com'
            }
        )
        if created:
            admin_user.set_password('admin123')  # 請在生產環境中更改此密碼
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('創建系統管理員帳號'))

        # 音樂主題清單
        music_themes = [
            {
                'name': '華語經典',
                'description': '收錄華語流行音樂中最具代表性的經典歌曲，從鄧麗君到周杰倫，重溫華語音樂的黃金歲月。',
                'is_featured': True
            },
            {
                'name': '日韓流行',
                'description': '精選最熱門的日韓流行音樂，包括K-POP熱門歌曲和J-POP經典曲目。',
                'is_featured': True
            },
            {
                'name': '運動健身',
                'description': '充滿活力的節奏，完美配合健身訓練，讓運動更有動力。',
                'is_featured': True
            },
            {
                'name': '咖啡時光',
                'description': '溫暖舒適的爵士和民謠音樂，最適合咖啡廳或是悠閒午後聆聽。',
                'is_featured': True
            },
            {
                'name': '工作專注',
                'description': '精選無歌詞的背景音樂，幫助您在工作時保持專注。',
                'is_featured': True
            }
        ]

        # 電影主題清單
        movie_themes = [
            {
                'name': '奧斯卡大獎',
                'description': '收錄歷年奧斯卡最佳影片獎項的獲獎和提名作品。',
                'is_featured': True
            },
            {
                'name': '動漫經典',
                'description': '精選來自全球的經典動畫電影，包括宮崎駿、迪士尼等大師作品。',
                'is_featured': True
            },
            {
                'name': '科幻冒險',
                'description': '探索未來世界的科幻電影，以及扣人心弦的冒險故事。',
                'is_featured': True
            },
            {
                'name': '華語佳片',
                'description': '來自兩岸三地的優秀華語電影，展現中華文化的獨特魅力。',
                'is_featured': True
            },
            {
                'name': '紓壓喜劇',
                'description': '輕鬆愉快的喜劇電影，讓您在歡笑中釋放壓力。',
                'is_featured': True
            }
        ]

        # 創建音樂主題清單
        for theme in music_themes:
            playlist, created = Playlist.objects.get_or_create(
                name=theme['name'],
                owner=admin_user,
                defaults={
                    'description': theme['description'],
                    'is_featured': theme['is_featured'],
                    'is_public': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'創建音樂主題清單: {theme["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'音樂主題清單已存在: {theme["name"]}'))

        # 創建電影主題清單
        for theme in movie_themes:
            watchlist, created = Watchlist.objects.get_or_create(
                name=theme['name'],
                owner=admin_user,
                defaults={
                    'description': theme['description'],
                    'is_featured': theme['is_featured'],
                    'is_public': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'創建電影主題清單: {theme["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'電影主題清單已存在: {theme["name"]}')) 