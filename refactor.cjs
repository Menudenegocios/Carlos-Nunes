const fs = require('fs');
const path = require('path');

const dirs = ['pages', 'components', 'services', 'contexts', '.'];
const ext = ['.ts', '.tsx'];

const replacements = {
  'userId': 'user_id',
  'createdAt': 'created_at',
  'imageUrl': 'image_url',
  'menuCash': 'menu_cash',
  'referralCode': 'referral_code',
  'referralsCount': 'referrals_count',
  'buyerId': 'buyer_id',
  'buyerName': 'buyer_name',
  'sellerId': 'seller_id',
  'sellerName': 'seller_name',
  'userName': 'user_name',
  'userAvatar': 'user_avatar',
  'businessName': 'business_name',
  'storeCategoryId': 'store_category_id',
  'promoPrice': 'promo_price',
  'videoUrl': 'video_url',
  'buttonType': 'button_type',
  'externalLink': 'external_link',
  'pointsReward': 'points_reward',
  'isLocal': 'is_local',
  'vitrineCategory': 'vitrine_category',
  'logoUrl': 'logo_url',
  'socialLinks': 'social_links',
  'storeConfig': 'store_config',
  'bioConfig': 'bio_config',
  'themeId': 'theme_id',
  'fontFamily': 'font_family',
  'customColors': 'custom_colors',
  'meshGradient': 'mesh_gradient',
  'floatingCTA': 'floating_cta',
  'socialProof': 'social_proof',
  'blogEnabled': 'blog_enabled',
  'blogButtonLabel': 'blog_button_label',
  'shareCard': 'share_card',
  'metaTitle': 'meta_title',
  'metaDescription': 'meta_description',
  'ogTitle': 'og_title',
  'ogDescription': 'og_description',
  'ogImage': 'og_image',
  'welcomeMessage': 'welcome_message',
  'avatarUrl': 'avatar_url',
  'coverUrl': 'cover_url',
  'bannerImages': 'banner_images',
  'themeColor': 'theme_color',
  'openingHours': 'opening_hours',
  'googleMapsLink': 'google_maps_link',
  'businessType': 'business_type',
  'salesType': 'sales_type',
  'aiChatEnabled': 'ai_chat_enabled',
  'schedulingEnabled': 'scheduling_enabled',
  'gaId': 'ga_id',
  'pixelId': 'pixel_id',
  'whatsappBot': 'whatsapp_bot',
  'vitrineTheme': 'vitrine_theme',
  'whatsappFormEnabled': 'whatsapp_form_enabled',
  'whatsappFormTitle': 'whatsapp_form_title',
  'vitrineNiche': 'vitrine_niche',
  'vitrineCity': 'vitrine_city',
  'videoPortfolio': 'video_portfolio',
  'aboutMe': 'about_me',
  'problemsSolved': 'problems_solved',
  'businessInterests': 'business_interests',
  'highlightedProductIds': 'highlighted_product_ids',
  'paymentMethods': 'payment_methods',
  'calendarLink': 'calendar_link',
  'expiryDate': 'expiry_date',
  'durationMinutes': 'duration_minutes',
  'meetingType': 'meeting_type',
  'googleCalendarConnected': 'google_calendar_connected',
  'seoTitle': 'seo_title',
  'seoDescription': 'seo_description',
  'seoKeywords': 'seo_keywords',
  'altText': 'alt_text',
  'googleMyBusinessSync': 'google_my_business_sync',
  'timelineEvent': 'timeline_event',
  'clientId': 'client_id',
  'lastContact': 'last_contact',
  'entityType': 'entity_type',
  'clientName': 'client_name',
  'serviceInterest': 'service_interest',
  'vitrineUserId': 'vitrine_user_id',
  'dueDate': 'due_date',
  'relatedTo': 'related_to',
  'smartGoalId': 'smart_goal_id',
  'projectId': 'project_id',
  'timeBound': 'time_bound',
  'keyPartners': 'key_partners',
  'keyActivities': 'key_activities',
  'valuePropositions': 'value_propositions',
  'customerRelationships': 'customer_relationships',
  'customerSegments': 'customer_segments',
  'keyResources': 'key_resources',
  'costStructure': 'cost_structure',
  'revenueStreams': 'revenue_streams'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [camel, snake] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${camel}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, snake);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'supabase' || file === 'brain') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (dirs.includes(dir) || dir === '.') {
         walkDir(fullPath);
      }
    } else if (ext.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

// Process the main directories
['pages', 'components', 'services', 'contexts'].forEach(d => walkDir(path.join(__dirname, d)));
// Process root ts/tsx files (types.ts, App.tsx, main.tsx)
const rootFiles = fs.readdirSync(__dirname);
for (const file of rootFiles) {
  if (ext.includes(path.extname(file)) && !fs.statSync(path.join(__dirname, file)).isDirectory() && file !== 'refactor.js' && file !== 'refactor.cjs') {
    processFile(path.join(__dirname, file));
  }
}

console.log('Refactoring complete.');
