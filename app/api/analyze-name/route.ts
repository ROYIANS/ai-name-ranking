import { NextResponse } from 'next/server';

// 默认API配置
const DEFAULT_API_URL = process.env.CUSTOM_API_URL || 'https://api.openai.com/v1/chat/completions';
const DEFAULT_API_KEY = process.env.CUSTOM_API_KEY || '';
const DEFAULT_MODEL = 'gpt-3.5-turbo';

export async function POST(req: Request) {
  try {
    const { name, apiUrl, apiKey, model } = await req.json();

    // 使用提供的API设置或默认设置
    const API_URL = apiUrl || DEFAULT_API_URL;
    const API_KEY = apiKey || DEFAULT_API_KEY;
    const MODEL = model || DEFAULT_MODEL;

    const prompt = `你是一名资深网络文化专家和网名鉴定师，绝对懂梗，精通中文互联网各种流行语、梗和亚文化。现在需要对网名"${name}"进行一次专业且有趣的深度解析。请用接地气、有梗、有趣的语言风格进行分析，同时保持专业性。

# 分析维度与评分标准
1. 风格创意 (30分)
- 独特性评估：这个名字有多"卷"？是否能在千篇一律的ID海洋中脱颖而出？
- 创意性分析：有多少"内卷"程度？是否有"整活"的成分？有没有"玩明白"？
- 个性表达：能否体现出用户是什么"亚子"的人？是"卷王"还是"摆烂大师"？

2. 寓意内涵 (40分)
- 梗度解析：蕴含了哪些经典梗或流行梗？梗的"含金量"如何？
- 文化解码：与二次元、游戏、影视、音乐等亚文化的关联度，是否"破次元壁"？
- 社交潜力：能否成为"破圈"利器？会不会引发"共鸣"或"破防"？
- 时代精神：是否反映了当代年轻人的精神状态？有没有"躺平"、"内卷"或"佛系"的元素？

3. 实用性 (30分)
- 传播性：能否轻松"破圈"，成为"爆款"ID？会不会被"挂在嘴边"？
- 平台适应性：在各大平台会不会被"夹"？是否符合"社区规范"？
- 记忆锁定：能否让人"一眼难忘"，产生"回头率"？

请严格按照以下格式返回分析结果，确保 JSON 位于分隔符之间：

=====JSON_START=====
{
  "score": 总分数值(70-100之间),
  "analysis": {
    "style": {
      "score": 风格分数,
      "uniqueness": "独特性评估（用网络流行语表达）",
      "creativity": "创意性分析（用网络流行语表达）",
      "personality": "个性表达（用网络流行语表达）"
    },
    "meaning": {
      "score": 寓意分数,
      "interpretation": "含义解读（用网络流行语表达）",
      "connotation": "深层寓意（用网络流行语表达）",
      "cultural": "文化联系（用网络流行语表达）",
      "overall": "整体评价（用网络流行语表达）"
    },
    "usability": {
      "score": 实用性分数,
      "readability": "易读性分析（用网络流行语表达）",
      "memorability": "记忆度评估（用网络流行语表达）",
      "versatility": "通用性分析（用网络流行语表达）"
    },
    "summary": "整体评价总结（用网络流行语表达，但保持专业性）"
  }
}
=====JSON_END=====

注意事项：
1. 分析要既专业又接地气，用网民听得懂的语言
2. 必须融入当下流行的网络用语和梗（如"绝绝子"、"真下头"、"太离谱"、"破防了"、"爷青回"等）
3. 考虑网名可能包含的二次元、游戏、影视等亚文化元素
4. 分析要有趣但不失专业性，让人感觉你很懂行
5. 总分不低于70分，但要诚实评价
6. 如果网名包含梗或玩梗成分，一定要指出并解释
7. 考虑网名在不同平台（B站、微博、抖音、小红书等）的适用性
8. 必须将JSON结果放在分隔符之间，不要添加任何额外的markdown标记`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('API响应格式错误');
    }

    const content = data.choices[0].message.content;
    
    // 提取JSON内容
    const jsonMatch = content.match(/=====JSON_START=====([\s\S]*?)=====JSON_END=====/);
    if (!jsonMatch) {
      // 如果没有找到分隔符，尝试直接解析整个内容
      try {
        return NextResponse.json(JSON.parse(content));
      } catch (error) {
        console.error('JSON解析错误:', error);
        throw new Error('JSON解析失败');
      }
    }

    try {
      const jsonContent = jsonMatch[1].trim();
      return NextResponse.json(JSON.parse(jsonContent));
    } catch (error) {
      console.error('JSON解析错误:', error);
      throw new Error('JSON解析失败');
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '分析过程中出现错误' },
      { status: 500 }
    );
  }
} 