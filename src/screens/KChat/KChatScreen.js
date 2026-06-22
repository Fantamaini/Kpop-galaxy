import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { KPOP_GROUPS } from '../../constants/data';

/**
 * KChat — Intelligent K-pop Assistant
 * Conversational UI with:
 *  - Group recommendations based on prefs
 *  - Bias personality analysis (simple)
 *  - Mini fan-scenarios / fun responses
 *  - Real K-pop knowledge answers (keyword driven)
 */
const QUICK_PROMPTS = [
  "Recommande-moi un groupe",
  "Analyse ma personnalité de bias",
  "Écris un scénario fanfic court",
  "Quel est le meilleur comeback 2024 ?",
  "Comment devenir un super fan ?"
];

const KNOWLEDGE = {
  'blackpink': 'BLACKPINK est sous YG. Leur dernier full album est "The Album" (2020) et "Born Pink". Jisoo a aussi lancé sa carrière solo.',
  'bts': 'BTS (HYBE) a révolutionné le K-pop mondial. Ils ont fait une pause de service militaire mais reviennent en force. "Dynamite" a été leur premier #1 Billboard Hot 100.',
  'twice': 'TWICE (JYP) est le "Nation\'s Girl Group". Leur discographie est énorme avec des hits comme "Fancy", "Feel Special", "The Feels".',
  'stray kids': 'Stray Kids (JYP) est connu pour l\'auto-production (3RACHA). "God\'s Menu" et "Thunderous" ont marqué l\'ère "NOEASY".',
  'newjeans': 'NewJeans (ADOR/HYBE) a révolutionné le concept avec "Attention" et "Ditto". Style Y2K + production 250.'
};

function getSmartReply(message, userGamif, favorites) {
  const msg = message.toLowerCase().trim();

  // Recommendations
  if (msg.includes('recommand') || msg.includes('suggère') || msg.includes('groupe')) {
    const favNames = (favorites.groups || []).map(g => g.name);
    const pool = KPOP_GROUPS.filter(g => !favNames.includes(g.name));
    const pick = pool[Math.floor(Math.random() * pool.length)] || KPOP_GROUPS[0];
    return `Je te recommande fortement **${pick.name}** (${pick.agency}). Leur énergie de scène est incroyable ! Tu veux que je te trouve des MVs ?`;
  }

  // Bias personality
  if (msg.includes('personnalit') || msg.includes('bias') || msg.includes('je suis fan de')) {
    const biases = userGamif?.biases || [];
    const biasText = biases.length ? biases.join(', ') : 'tes biases actuels';
    return `D'après tes stats et ${biasText}, tu es probablement quelqu'un de loyal, créatif et passionné. Tu aimes les concepts profonds et les performances intenses. Est-ce que ça te ressemble ?`;
  }

  // Fanfiction / scenario
  if (msg.includes('scénario') || msg.includes('fanfic') || msg.includes('rencontre')) {
    return `🌟 Scénario rapide : Tu es en coulisses après un concert. Bang Chan (Stray Kids) te remarque et dit "Tu as l'air d'avoir la meilleure vibe du public ce soir... Tu veux un selfie spécial ?". Que fais-tu ? (Réponds pour continuer l'histoire)`;
  }

  // Knowledge base
  for (const [key, answer] of Object.entries(KNOWLEDGE)) {
    if (msg.includes(key)) return answer;
  }

  if (msg.includes('comeback') || msg.includes('2024') || msg.includes('2025')) {
    return '2024-2025 a été dingue : aespa Supernova, NewJeans Supernatural, LE SSERAFIM Easy, et le retour triomphal de nombreux groupes après les services militaires. Tu veux des recommandations précises ?';
  }

  if (msg.includes('fan') || msg.includes('devenir')) {
    return 'Pour devenir un super fan : suis les schedules, participe aux quizzes, collecte les merch officiels, rejoins les fanbases locales et surtout... soutiens légalement (streaming + achats). Ton XP augmente à chaque interaction !';
  }

  // Default friendly K-pop assistant
  return `J\'adore cette question ! En tant qu\'assistant K-pop Galaxy, je peux t\'aider avec des recommandations, des analyses de bias, des quizzes bonus et même des petites histoires. Dis-moi ce qui t\'intéresse le plus aujourd\'hui 💜`;
}

export default function KChatScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useSelector(s => s.auth.user);
  const gamification = useSelector(s => s.gamification);
  const favorites = useSelector(s => s.favorites);

  const [messages, setMessages] = useState([
    { id: 'm0', from: 'bot', text: 'Annyeong ! Je suis KChat, ton assistant K-pop intelligent. Que veux-tu savoir ou faire aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (customText) => {
    const text = (customText || input).trim();
    if (!text) return;

    const userMsg = { id: 'u' + Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate "AI" thinking
    setTimeout(() => {
      const replyText = getSmartReply(text, gamification, favorites);
      const botMsg = { id: 'b' + Date.now(), from: 'bot', text: replyText };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const renderMessage = ({ item }) => {
    const isBot = item.from === 'bot';
    return (
      <View style={[styles.msgRow, isBot ? styles.botRow : styles.userRow]}>
        {isBot && (
          <LinearGradient colors={[COLORS.gradient.start, COLORS.gradient.end]} style={styles.botAvatar}>
            <Text style={{ color: '#fff', fontSize: 16 }}>💬</Text>
          </LinearGradient>
        )}
        <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble, { backgroundColor: isBot ? colors.card : colors.primary }]}>
          <Text style={[styles.msgText, { color: isBot ? colors.text : '#FFFFFF' }]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.title, { color: colors.text }]}>KChat</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Assistant K-pop Intelligent</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.chat}
          ListFooterComponent={isTyping ? <Text style={{ color: colors.textSecondary, paddingLeft: 16 }}>KChat est en train d\'écrire...</Text> : null}
        />

        {/* Quick prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.prompts}>
          {QUICK_PROMPTS.map((p, i) => (
            <TouchableOpacity key={i} style={[styles.promptPill, { backgroundColor: colors.card }]} onPress={() => sendMessage(p)}>
              <Text style={{ color: colors.text, fontSize: 12 }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Parle à KChat..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={() => sendMessage()} style={[styles.send, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingTop: SPACING.xl
  },
  title: { fontSize: FONTS.sizes.xl, fontWeight: '800' },
  subtitle: { fontSize: FONTS.sizes.xs },
  chat: { padding: SPACING.lg, paddingBottom: 120 },
  msgRow: { flexDirection: 'row', marginBottom: SPACING.sm, alignItems: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginRight: 8
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.lg
  },
  botBubble: { borderBottomLeftRadius: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  msgText: { fontSize: FONTS.sizes.sm, lineHeight: 20 },
  prompts: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  promptPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8
  },
  composer: {
    flexDirection: 'row',
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    paddingLeft: SPACING.md,
    alignItems: 'center'
  },
  input: { flex: 1, fontSize: FONTS.sizes.md, paddingVertical: 10 },
  send: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 4 }
});
