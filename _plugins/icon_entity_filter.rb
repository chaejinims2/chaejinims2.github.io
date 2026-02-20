# frozen_string_literal: true
# 빌드 시 hex 코드포인트 → HTML entity 로 변환해 첫 페인트부터 아이콘 표시 (깜빡임 방지)
module Jekyll
  module IconEntityFilter
    def icon_entity(hex_str)
      return "" if hex_str.nil? || hex_str.to_s.strip.empty?
      parts = hex_str.to_s.split(",").map { |h| "&#x#{h.strip};" }
      # HTML로 출력되도록 SafeString (이스케이프 방지)
      Jekyll::Utils::SafeString.new(parts.join(""))
    end
  end
end
Liquid::Template.register_filter(Jekyll::IconEntityFilter)
