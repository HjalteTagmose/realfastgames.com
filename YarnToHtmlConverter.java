import java.util.*;
import java.io.*;
import java.util.regex.*;

public class YarnToHtmlConverter {

    public static void main(String[] args) throws Exception
    {
        // System.out.println("Input yarn file: ");

        // HTML start and end
        String htmlStart = "<!DOCTYPE html>\n"+
            "<html>\n"+
            "<head>\n"+
                "\t<link href=\"style.css\" rel=\"stylesheet\">\n"+
            "</head>\n"+
            "<body style=\"background-color: white;\" class=\"bubbleBody\">\n";
        String htmlEnd = "\t<div id=\"typewriter\"></div>\n"+
            "</body>\n"+
            "</html>\n";

        // Get yarn file
        String yarnPath = "C:\\dev\\web\\realfastgames.com\\dialogue.yarn";
        String htmlPath = "C:\\dev\\web\\realfastgames.com\\speechbubble.html";
        // String path = new String(System.in.readAllBytes()).trim(); 
        // System.out.println(path);
        StringBuilder yarn = new StringBuilder();

        try {
            File myObj = new File(yarnPath);
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                yarn.append( myReader.nextLine() );
                yarn.append( "\n" );
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        // Write HTML file
        String html = GenerateHTML(yarn.toString());
        File fold = new File(htmlPath);
        fold.delete();
        File fnew = new File(htmlPath);
        try {
            FileWriter f2 = new FileWriter(fnew);
            f2.write(htmlStart);
            f2.write(html);
            f2.write(htmlEnd);
            f2.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String GenerateHTML(String yarn)
    {
        Pattern nodesPattern = Pattern.compile("([^=]*===)"              , Pattern.MULTILINE);
        Pattern titlePattern = Pattern.compile("title: (.*)"             , Pattern.MULTILINE);
        Pattern innerPattern = Pattern.compile("---([^=]*)==="           , Pattern.MULTILINE);
        Pattern replyPattern = Pattern.compile("-->(.*)"                 , Pattern.MULTILINE);
        Pattern jumpsPattern = Pattern.compile("-->[^<]*<<jump ([^>]*)>>", Pattern.MULTILINE);
        Pattern dtextPattern = Pattern.compile("(([^>])*.$)"             , Pattern.MULTILINE);
        
        Matcher m = nodesPattern.matcher(yarn);
        StringBuilder html = new StringBuilder(); 

        while (m.find())
        {
            String node  = m.group(1).trim();
            String title = GetMatch(titlePattern, node , 1);
            String inner = GetMatch(innerPattern, node , 1);
            String dtext = GetMatch(dtextPattern, inner, 1);
            var replies= GetMatches(replyPattern, inner, 1);
            var jumps  = GetMatches(jumpsPattern, inner, 1);

            // System.out.println(title);
            // System.out.println(inner);
            // System.out.println(dtext);
            // System.out.println(replies);

            html.append(String.format(
                "\t<div id=\"%s\" style=\"display: none;\"" +
                    "\n\t>%s\n\n", title, dtext));

            for (int i = 0; i < replies.size(); i++) 
            {
                String jump = jumps.get(i);
                String reply= replies.get(i);

                html.append(String.format(
                    "\t\t<a href=\"%s\">%s</a>\n",
                    jump, reply));
            }
            html.append("\t</div>\n");
        }

        return html.toString();
    }

    private static String GetMatch(Pattern p, String text, int group)
    {
        Matcher m = p.matcher(text);
        m.find();
        return m.group(group).trim();
    } 

    private static List<String> GetMatches(Pattern p, String text, int group)
    {
        List<String> matches = new ArrayList<>();
        Matcher m = p.matcher(text);

        while(m.find())
            matches.add(m.group(group).trim());

        return matches;
    }
}
